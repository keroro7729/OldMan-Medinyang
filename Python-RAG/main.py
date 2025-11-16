from fastapi import FastAPI
from api.routes import router as api_router

# FastAPI 앱 생성
app = FastAPI(
    title="메디냥 RAG API",
    description="문서 기반 질의응답 및 폴백 기능을 제공하는 AI API",
    version="1.0.0"
)

# "/ask" 경로가 포함된 라우터를 앱에 등록
app.include_router(api_router)

@app.get("/", summary="Health Check")
def read_root():
    """
    서버가 정상적으로 실행 중인지 확인하는 헬스 체크 엔드포인트입니다.
    """
    return {"status": "ok", "message": "메디냥 RAG API가 정상적으로 실행 중입니다."}

# uvicorn main:app --reload 명령어로 실행하세요.