# make_db.py (오류 진단 기능 추가 버전)

import os
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

# .env 파일에서 환경 변수 로드
load_dotenv()

def create_and_save_db():
    try:
        print("✅ 데이터베이스 생성을 시작합니다...")

        # 1. 문서 로드
        print("📄 1단계: PDF 파일을 로드합니다...")
        loader = PyMuPDFLoader("./예제파일.pdf")
        docs = loader.load()
        print(f"✔️ PDF 로드 완료. 총 {len(docs)} 페이지.")

        # 2. 문서 분할
        print("✂️ 2단계: 문서를 작은 조각으로 분할합니다...")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        split_documents = text_splitter.split_documents(docs)
        print(f"✔️ 문서 분할 완료. 총 {len(split_documents)} 조각.")

        # 3. 임베딩 및 DB 저장
        print("🧠 3단계: 텍스트를 벡터로 변환하고 DB를 생성합니다... (이 과정은 시간이 걸릴 수 있습니다)")
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.from_documents(documents=split_documents, embedding=embeddings)
        print("✔️ 벡터 변환 및 DB 생성 완료.")

        # 4. DB를 로컬 파일로 저장
        print("💾 4단계: 생성된 데이터베이스를 'db' 폴더에 저장합니다...")
        vectorstore.save_local("db")
        
        print("\n🎉 데이터베이스 생성 완료! 'db' 폴더에 파일이 성공적으로 저장되었습니다.")

    except Exception as e:
        print("\n❌ 오류가 발생했습니다!")
        print("--------------------------------------------------")
        print(f"오류 종류: {type(e).__name__}")
        print(f"오류 메시지: {e}")
        print("--------------------------------------------------")
        print("🤔 해결 방법 제안:")
        print("1. .env 파일에 OPENAI_API_KEY가 올바르게 입력되었는지 확인하세요.")
        print("2. 예제파일.pdf 파일이 현재 폴더에 있는지 확인하세요.")
        print("3. 인터넷 연결을 확인하세요.")

if __name__ == "__main__":
    create_and_save_db()