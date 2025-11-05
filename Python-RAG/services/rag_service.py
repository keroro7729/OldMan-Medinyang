# services/rag_service.py

from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

# 우리가 만든 설정과 프롬프트를 가져옵니다.
import config
from prompts import medi_nyang_prompt

# LangSmith 설정 실행
config.setup_langsmith()

# --- RAG 파이프라인 초기화 (서버 시작 시 1회 실행) ---
# 이 객체들은 서버가 켜질 때 메모리에 미리 로드됩니다.

try:
    print("서비스 모듈: 데이터베이스 로드를 시도합니다...")
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.load_local(
        config.DB_PATH, 
        embeddings, 
        allow_dangerous_deserialization=True
    )
    retriever = vectorstore.as_retriever()
    print("서비스 모듈: 데이터베이스 로드 성공.")

    # RAG 체인 생성
    rag_llm = ChatOpenAI(model_name=config.RAG_MODEL_NAME, temperature=0)
    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | medi_nyang_prompt
        | rag_llm
        | StrOutputParser()
    )
    print("서비스 모듈: RAG 체인 생성 완료.")

    # 폴백 LLM 생성
    fallback_llm = ChatOpenAI(model_name=config.FALLBACK_MODEL_NAME, temperature=0.7)
    print("서비스 모듈: 폴백 LLM 생성 완료.")

except Exception as e:
    print(f"FATAL: RAG 서비스 초기화 실패: {e}")
    # 실제 서비스라면 여기서 로그를 남기고 프로세스를 종료해야 합니다.
    rag_chain = None
    fallback_llm = None

# --- 실제 API가 호출할 함수 ---

def get_answer(user_question: str) -> str:
    """
    사용자 질문을 받아 RAG 체인을 실행하고, 필요시 폴백 로직을 수행합니다.
    """
    if not rag_chain or not fallback_llm:
        return "오류: RAG 서비스가 올바르게 초기화되지 않았습니다. 관리자에게 문의하세요."

    # 1. RAG 체인 답변 시도
    rag_response = rag_chain.invoke(user_question)
    
    # 2. 폴백 여부 결정
    if any(keyword in rag_response.strip() for keyword in config.FALLBACK_KEYWORDS):
        print("⚠️ 문서에 답변이 없어 일반 GPT 모델(폴백)을 호출합니다...")
        
        # 3. 폴백 실행
        fallback_response = fallback_llm.invoke(user_question)
        final_answer = fallback_response.content 
    else:
        # 4. RAG 답변 사용
        final_answer = rag_response

    return final_answer