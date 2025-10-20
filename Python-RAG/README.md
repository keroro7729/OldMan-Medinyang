# 🤖 FastAPI RAG 챗봇 (Poetry)
FastAPI와 Poetry를 기반으로 구축된 RAG(Retrieval-Augmented Generation) 챗봇 API 서버입니다.

이 프로젝트는 poetry.lock 파일을 통해 모든 팀원의 개발 환경을 동일하게 합니다.

## 1. 🛠️ 사전 준비 (필수)
이 프로젝트를 실행하기 전에, 팀원의 PC에 다음 세 가지가 반드시 설치되어 있어야 합니다.

Git: 프로젝트를 복제(clone)하기 위해 필요합니다.

Python 3.11.2: **(매우 중요!)** 이 프로젝트는 3.11.2 버전으로 고정되어 있습니다. py --list (Windows) 또는 which python3.11 (macOS/Linux) 명령어로 3.11.2가 설치되어 있는지 확인하세요.

Poetry: 파이썬 패키지 및 가상환경 관리 도구입니다.

(설치)
```bash
pip install poetry
```

## 2. 🚀 프로젝트 환경 설정
터미널(명령 프롬프트 또는 PowerShell)에서 다음 단계를 순서대로 실행하세요.

1. **프로젝트 복제 (Clone)**
```bash
git clone <프로젝트_저장소_URL>
cd Python-RAG
(참고: <프로젝트_저장소_URL> 부분은 실제 Git 저장소 주소로 변경해 주세요.)
```

2. API 키 설정 (.env 파일)
프로젝트 루트 폴더(main.py가 있는 곳)에 .env 파일을 직접 생성하고, 다음 내용을 채워넣으세요. 이 파일은 Git에 포함되지 않습니다.

```env
OPENAI_API_KEY="KEY-VALUE"
LANGCHAIN_API_KEY="key_VALUE"
```
**KEY-VALUE는 디스코드를 참고하세요.**

3. (핵심) 라이브러리 설치
다음 명령어를 실행하면, Poetry가 pyproject.toml과 poetry.lock 파일을 읽어 팀원 모두와 100% 동일한 버전의 라이브러리를 3.11.2 기반의 가상환경(.venv)에 자동으로 설치합니다.

```Bash
poetry install
```

[설치 오류 발생 시]

만약 Poetry가 3.11.2 버전을 자동으로 찾지 못한다면, 다음 명령어를 먼저 실행하여 파이썬 버전을 수동으로 지정해 준 뒤, 다시 poetry install을 시도하세요.

1. 3.11.2 버전을 사용하도록 Poetry에 명시

```Bash
poetry env use 3.11.2
```

2. 설치 재시도
```Bash
poetry install
```

## 3. 🏃‍♂️ 애플리케이션 실행
환경 설정이 완료되었습니다. 서버를 실행하는 방법은 2단계로 나뉩니다.

모든 스크립트는 poetry run을 앞에 붙여 실행해야, Poetry가 관리하는 가상환경에서 올바르게 동작합니다.

1단계: **벡터 DB 생성**
서버를 켜기 전, 예제파일.pdf를 기반으로 한 로컬 벡터 DB(db 폴더)를 생성해야 합니다.

```Bash
poetry run python make_db.py
( ✅ 데이터베이스 생성을 시작합니다... 메시지와 함께 db 폴더가 생성되면 성공입니다. )
```

로컬 벡터 DB는 처음 한번만 생성하면 됩니다.(**PDF파일이 변경되었으면 재실행 필수**)

2단계: **FastAPI 서버 실행**
db 폴더가 생성되었다면, 이제 API 서버를 실행합니다.

```Bash
poetry run uvicorn main:app --reload
( --reload 옵션은 코드가 변경될 때마다 서버를 자동으로 재시작해 줍니다. )
```

터미널에 Uvicorn running on http://127.0.0.1:8000 메시지가 나타나면 성공입니다.

## 4. ✅ 테스트
웹 브라우저에서 http://127.0.0.1:8000/docs로 접속하면, API 문서를 확인하고 직접 질문을 테스트해 볼 수 있습니다.