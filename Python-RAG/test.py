# test_imports.py

print("--- 1. 기본 라이브러리 임포트 시작 ---")

try:
    import os
    import shutil
    from dotenv import load_dotenv
    print("OK: os, shutil, dotenv 임포트 성공.")

    from langchain_text_splitters import RecursiveCharacterTextSplitter
    print("OK: RecursiveCharacterTextSplitter 임포트 성공.")

    # --- 2. ⚠️ 용의자 1: JSONLoader ---
    print("\n--- 2. JSONLoader 임포트 시도... ---")
    from langchain_community.document_loaders import JSONLoader
    print("OK: JSONLoader 임포트 성공.")

    # --- 3. ⚠️ 용의자 2: DirectoryLoader ---
    print("\n--- 3. DirectoryLoader 임포트 시도... ---")
    from langchain_community.document_loaders import DirectoryLoader
    print("OK: DirectoryLoader 임포트 성공.")

    # --- 4. 나머지 LangChain 라이브러리 ---
    print("\n--- 4. 나머지 LangChain 임포트 시도... ---")
    from langchain_community.vectorstores import FAISS
    print("OK: FAISS 임포트 성공.")

    from langchain_openai import OpenAIEmbeddings
    print("OK: OpenAIEmbeddings 임포트 성공.")

    print("\n✅✅✅ 모든 임포트에 성공했습니다! ✅✅✅")

except Exception as e:
    print(f"\n❌❌❌ 임포트 중 오류가 발생했습니다: {e}")