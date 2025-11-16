import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수를 로드
load_dotenv()

# --- LangSmith 설정 ---
LANGCHAIN_TRACING_V2 = os.getenv("LANGCHAIN_TRACING_V2", "true")
LANGCHAIN_ENDPOINT = os.getenv("LANGCHAIN_ENDPOINT", "https://api.smith.langchain.com")
LANGCHAIN_PROJECT = os.getenv("LANGCHAIN_PROJECT", "김지훈")
LANGCHAIN_API_KEY = os.getenv("LANGCHAIN_API_KEY")

# --- OpenAI 설정 ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") # .env에 OPENAI_API_KEY도 있어야 합니다.

# --- 모델 설정 ---
RAG_MODEL_NAME = "gpt-4o-mini"
FALLBACK_MODEL_NAME = "gpt-4o"
EMBEDDING_MODEL_NAME = "text-embedding-ada-002" # (FAISS 생성 시 사용한 모델)

# --- DB 경로 ---
DB_PATH = "db"

# --- 폴백 키워드 ---
FALLBACK_KEYWORDS = ["모르겠어요", "없습니다", "제공된 문서에서는 해당 정보를 찾을 수 없습니다", "모르는 내용입니다."]

# 1. Base Retriever가 벡터 DB에서 확보할 문서의 개수 (Recall 확보)
BASE_K = 20 

# 2. Reranker가 재순위 지정 후 LLM에게 최종 전달할 문서의 개수 (Precision 유지)
RERANK_K = 6

RERANK_TOP_N = 5  # reranker가 상위 몇 개 문서만 사용할지



# LangSmith 환경 변수 설정 실행
def setup_langsmith():
    os.environ["LANGCHAIN_TRACING_V2"] = LANGCHAIN_TRACING_V2
    os.environ["LANGCHAIN_ENDPOINT"] = LANGCHAIN_ENDPOINT
    os.environ["LANGCHAIN_PROJECT"] = LANGCHAIN_PROJECT
    os.environ["LANGCHAIN_API_KEY"] = LANGCHAIN_API_KEY
    
    
    