from fastapi import APIRouter
from pydantic import BaseModel

# 핵심 로직이 담긴 서비스 모듈을 가져옵니다.
from services.rag_service import get_answer

# 이 파일은 /ask 경로를 담당하는 라우터입니다.
router = APIRouter()

# 요청 바디(Request Body) 모델 정의
class QuestionRequest(BaseModel):
    question: str

# 응답 바디(Response Body) 모델 정의
class AnswerResponse(BaseModel):
    answer: str

@router.post("/ask", response_model=AnswerResponse)
def ask_question(request: QuestionRequest):
    """
    사용자 질문을 받아 RAG 서비스에 전달하고 답변을 반환합니다.
    """
    # 모든 복잡한 로직은 get_answer 함수에 위임합니다.
    final_answer = get_answer(request.question)
    
    return AnswerResponse(answer=final_answer)