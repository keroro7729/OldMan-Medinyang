import os
import shutil
import time # time 라이브러리 추가
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, JSONLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

# .env 파일에서 환경 변수 로드
load_dotenv()

# --- [설정] ---
ANSWER_DIR = "./data/" 
# 임베딩 API 호출 시 Rate Limit을 피하기 위한 설정
BATCH_SIZE = 500       # 한 번의 API 요청에 보낼 문서 조각 수 (30만 토큰 제한 회피)
DELAY_SECONDS = 12     # 분당 5회 요청(60초 / 5회)을 목표로 12초 지연 설정
# -----------------

def create_and_save_db():
    try:
        print("✅ 데이터베이스 생성을 시작합니다... (모든 하위 폴더의 JSON 데이터 사용)")

        # 1. 문서 로드 (DirectoryLoader + JSONLoader)
        print(f"📄 1단계: '{ANSWER_DIR}' 폴더 하위의 **모든 .json** 파일을 로드합니다...")

        # jq 스키마: JSON 파일에서 필요한 필드만 추출하여 텍스트로 변환
        jq_schema = (
            '"질병명: " + .disease_name.kor + "\n" + '
            '"진료과: " + (.department[0] // "정보 없음") + "\n" + '
            '"목적: " + .intention + "\n\n" + '
            '"답변: " + .answer.intro + " " + .answer.body + " " + .answer.conclusion'
        )

        loader = DirectoryLoader(
            ANSWER_DIR,
            glob="**/*.json", 
            loader_cls=JSONLoader, 
            loader_kwargs={'jq_schema': jq_schema, 'text_content': True}, 
            show_progress=True, 
            use_multithreading=False
        )

        docs = loader.load()

        if not docs:
            print(f"❌ 오류: '{ANSWER_DIR}' 하위 폴더에서 .json 파일을 찾지 못했습니다.")
            return

        print(f"✔️ 로드 완료. 총 {len(docs)}개의 답변 문서를 찾았습니다.")

        # 2. 문서 분할
        print("✂️ 2단계: 텍스트를 적절한 크기로 분할합니다...")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        split_documents = text_splitter.split_documents(docs)
        total_chunks = len(split_documents)
        print(f"✔️ 문서 분할 완료. 총 {total_chunks} 조각.")

        # 3. 임베딩 및 DB 저장 (커스텀 배치 처리 로직)
        print("🧠 3단계: 텍스트를 벡터로 변환하고 DB를 생성합니다... (시간이 걸릴 수 있습니다)")
        
        # OpenAIEmbeddings 초기화 (chunk_size=500 설정은 FAISS.from_documents에서 내부적으로 사용되나, 
        # Rate Limit 회피를 위해 수동 배치 처리를 사용하므로, 여기서는 기본 설정으로 둡니다.)
        embeddings = OpenAIEmbeddings()

        # 첫 번째 배치로 FAISS 인덱스 생성
        first_batch = split_documents[:BATCH_SIZE]
        vectorstore = FAISS.from_documents(documents=first_batch, embedding=embeddings)
        
        total_batches = (total_chunks + BATCH_SIZE - 1) // BATCH_SIZE # 올림 계산

        print(f"🔄 총 {total_batches} 배치를 처리합니다. (배치 크기: {BATCH_SIZE} 조각)")
        print(f"   [1/{total_batches} 배치] 생성 완료. 다음 배치까지 {DELAY_SECONDS}초 대기...")
        
        if total_batches > 1:
            time.sleep(DELAY_SECONDS)

        # 나머지 배치를 순회하며 인덱스에 추가
        for i in range(BATCH_SIZE, total_chunks, BATCH_SIZE):
            batch = split_documents[i:i + BATCH_SIZE]
            batch_num = i // BATCH_SIZE + 1

            # 임베딩 생성 및 인덱스 병합
            vectorstore.add_documents(batch)
            print(f"   [{batch_num}/{total_batches} 배치] 추가 완료. 다음 배치까지 {DELAY_SECONDS}초 대기...")
            
            # Rate Limit 회피를 위한 지연 (마지막 배치는 제외)
            if i + BATCH_SIZE < total_chunks:
                time.sleep(DELAY_SECONDS)

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
        print("🤔 문제가 지속되면 BATCH_SIZE와 DELAY_SECONDS 설정을 조정해 보세요.")

if __name__ == "__main__":
    create_and_save_db()