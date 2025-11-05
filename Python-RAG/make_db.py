# make_db.py (최종 클린 버전)

import os
import shutil
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, JSONLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

# .env 파일에서 환경 변수 로드
load_dotenv()

# --- [설정] 답변 JSON 파일들이 모여있는 폴더 경로 ---
ANSWER_DIR = "./data/answers/" 
# ---------------------------------------------------

def create_and_save_db():
    try:
        print("✅ 데이터베이스 생성을 시작합니다... (답변 데이터만 사용)")

        # 1. 문서 로드 (DirectoryLoader + JSONLoader)
        print(f"📄 1단계: '{ANSWER_DIR}' 폴더에서 모든 답변(HC-A-*.json) 파일을 로드합니다...")

        # 'HC-A-....json' 파일 하나를 기준으로 jq 스키마를 작성합니다.
        jq_schema = (
            '"질병명: " + .disease_name.kor + "\n" + '
            '"진료과: " + (.department[0] // "정보 없음") + "\n" + '
            '"목적: " + .intention + "\n\n" + '
            '"답변: " + .answer.intro + " " + .answer.body + " " + .answer.conclusion'
        )

        # 폴더 전체를 읽는 로더 정의
        loader = DirectoryLoader(
            ANSWER_DIR,
            glob="**/HC-A-*.json", # 폴더 하위까지 모든 HC-A-*.json 파일을 검색
            loader_cls=JSONLoader, # 각 파일을 JSONLoader로 읽음
            loader_kwargs={'jq_schema': jq_schema, 'text_content': True}, # JSONLoader에 옵션 전달
            show_progress=True, # 진행률 표시
            use_multithreading=False # True로 설정 시 Windows/Poetry에서 충돌 가능성 있음
        )

        docs = loader.load()

        if not docs:
            print(f"❌ 오류: '{ANSWER_DIR}'에서 'HC-A-*.json' 파일을 찾지 못했습니다.")
            print("🤔 ANSWER_DIR 경로가 올바른지, 파일 이름 형식이 맞는지 확인하세요.")
            return

        print(f"✔️ 로드 완료. 총 {len(docs)}개의 답변 문서를 찾았습니다.")

        # 2. 문서 분할 (답변이 길 경우를 대비해 유지)
        print("✂️ 2단계: 텍스트를 적절한 크기로 분할합니다...")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        split_documents = text_splitter.split_documents(docs)
        print(f"✔️ 문서 분할 완료. 총 {len(split_documents)} 조각.")

        # 3. 임베딩 및 DB 저장
        print("🧠 3단계: 텍스트를 벡터로 변환하고 DB를 생성합니다... (시간이 걸릴 수 있습니다)")
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.from_documents(documents=split_documents, embedding=embeddings)
        print("✔️ 벡터 변환 및 DB 생성 완료.")

        # 4. DB를 로컬 파일로 저장
        print("💾 4단계: 생성된 데이터베이스를 'db' 폴더에 저장합니다...")
        if os.path.exists("db"):
            shutil.rmtree("db")
        vectorstore.save_local("db")
        
        print("\n🎉 데이터베이스 생성 완료! 'db' 폴더에 파일이 성공적으로 저장되었습니다.")

    except Exception as e:
        print("\n❌ 오류가 발생했습니다!")
        print("--------------------------------------------------")
        print(f"오류 종류: {type(e).__name__}")
        print(f"오류 메시지: {e}")
        print("--------------------------------------------------")
        print("🤔 .env 파일의 OPENAI_API_KEY가 유효한지, 인터넷 연결을 확인하세요.")

if __name__ == "__main__":
    create_and_save_db()