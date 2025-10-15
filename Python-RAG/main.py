# main.py

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

# .env 파일에서 환경 변수 로드
load_dotenv()

# FastAPI 앱 생성
app = FastAPI()

# --- 서버 시작 시 딱 한 번만 실행될 부분 ---
print("미리 만들어진 데이터베이스를 로드합니다...")

# 1. 임베딩 모델 준비 (DB 로드 시 필요)
embeddings = OpenAIEmbeddings()

# 2. 로컬 파일에서 DB 불러오기 
# allow_dangerous_deserialization=True는 FAISS가 pickle 파일을 안전하게 로드하기 위한 필수 옵션입니다.
vectorstore = FAISS.load_local("db", embeddings, allow_dangerous_deserialization=True)

# 3. 체인생성
retriever = vectorstore.as_retriever()
prompt = PromptTemplate.from_template(
    """You are an assistant for question-answering tasks. 
Use the following pieces of retrieved context to answer the question. 
If you don't know the answer, just say that you don't know. 
Answer in Korean.

#Question: 
{question} 
#Context: 
{context} 

#Answer:"""
) 
llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
print("데이터베이스 로드 및 RAG 파이프라인 준비 완료!")

# --- API 요청 처리 부분 ---
class QuestionRequest(BaseModel):
    question: str

@app.post("/ask")
def ask_question(request: QuestionRequest):
    user_question = request.question
    
    # 1. 먼저 RAG 체인을 통해 답변을 시도합니다.
    rag_response = chain.invoke(user_question)
    
    # 2. RAG 체인의 답변을 확인하여 '폴백'이 필요한지 결정
    fallback_keywords = ["모르겠어요", "없습니다", "제공된 문서에서는 해당 정보를 찾을 수 없습니다"]
    
    if any(keyword in rag_response.strip() for keyword in fallback_keywords):
        print("⚠️ 문서에 답변이 없어 일반 GPT 모델을 호출합니다...")
        
        # 3. 폴백이 필요하면, 별도의 일반 GPT 모델을 호출
        #    (RAG 체인에 사용된 모델과 다를 수 있습니다)
        fallback_llm = ChatOpenAI(model_name="gpt-4o", temperature=0.7) 
        
        fallback_response = fallback_llm.invoke(user_question)
        final_answer = fallback_response.content 

    else:
        # 4. 문서에서 답변을 찾았으면, RAG 체인의 답변을 그대로 사용
        final_answer = rag_response

    # 5. 최종 결정된 답변을 사용자에게 반환합니다.
    return {"answer": final_answer}