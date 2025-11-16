
import os
import json
import glob
from tqdm import tqdm # 진행률 표시


QUESTION_DIR = "./data/questions/"  # 질문 JSON 파일들이 모여있는 폴더 (HC-Q-...)
ANSWER_DIR = "./data/answers/"    # 답변 JSON 파일들이 모여있는 폴더 (HC-A-...)
OUTPUT_FILE = "./data/merged_data.json" # 최종적으로 하나로 합쳐질 파일 경로


def get_file_id(filepath):
    """파일 경로에서 'HC-Q-1160428.json' -> '1160428' 부분만 추출합니다."""
    filename = os.path.basename(filepath)
    try:
        parts = filename.split('-')
        if len(parts) >= 3:
            return parts[2].split('.')[0]
    except Exception as e:
        print(f"경고: 파일 이름 형식 분석 실패 {filename}: {e}")
        return None

def merge_qa_data():
    print("✅ 데이터 전처리를 시작합니다...")
    print(f"질문 폴더 (검색 대상): {os.path.abspath(QUESTION_DIR)}")
    print(f"답변 폴더 (검색 대상): {os.path.abspath(ANSWER_DIR)}")

    # 1. 모든 답변(A) 파일의 경로를 미리 '딕셔너리'로 만들어 빠르게 찾도록 합니다.
    answer_files = {}
    # `recursive=True`로 하위 폴더까지 모두 검색합니다.
    for a_filepath in glob.glob(os.path.join(ANSWER_DIR, "**/HC-A-*.json"), recursive=True):
        file_id = get_file_id(a_filepath)
        if file_id:
            answer_files[file_id] = a_filepath
    
    if not answer_files:
        print(f"⚠️ 경고: '{ANSWER_DIR}'에서 'HC-A-*.json' 답변 파일을 찾지 못했습니다. 경로를 확인하세요.")
        return
    print(f"총 {len(answer_files)}개의 답변 파일을 찾았습니다.")

    # 2. 모든 질문(Q) 파일을 순회하면서 짝을 찾습니다.
    merged_data = [] # 최종 결과물이 담길 리스트
    missing_answers = 0 # 짝을 찾지 못한 질문 수

    question_filepaths = glob.glob(os.path.join(QUESTION_DIR, "**/HC-Q-*.json"), recursive=True)
    if not question_filepaths:
        print(f"⚠️ 경고: '{QUESTION_DIR}'에서 'HC-Q-*.json' 질문 파일을 찾지 못했습니다. 경로를 확인하세요.")
        return
            
    print(f"총 {len(question_filepaths)}개의 질문 파일을 기준으로 병합을 시작합니다.")

    for q_filepath in tqdm(question_filepaths, desc="Q/A 데이터 병합 중"):
        file_id = get_file_id(q_filepath)
        if not file_id:
            continue

        # 3. 짝이 되는 답변 파일이 있는지 확인합니다.
        if file_id in answer_files:
            a_filepath = answer_files[file_id]

            try:
                # 4. Q/A 파일을 각각 열어서 데이터를 추출합니다.
                with open(q_filepath, 'r', encoding='utf-8') as f: q_data = json.load(f)
                with open(a_filepath, 'r', encoding='utf-8') as f: a_data = json.load(f)

                # 5. 필요한 정보를 조합하여 하나의 텍스트로 합칩니다.
                question_text = q_data.get("question", "")
                
                answer_obj = a_data.get("answer", {})
                answer_intro = answer_obj.get("intro", "")
                answer_body = answer_obj.get("body", "")
                answer_conclusion = answer_obj.get("conclusion", "")
                combined_answer = f"{answer_intro} {answer_body} {answer_conclusion}".strip()

                # RAG DB에 저장할 최종 텍스트 형태
                combined_text = f"Q: {question_text}\nA: {combined_answer}"
                
                # 새로운 JSON 객체 생성
                new_entry = {
                    "file_id": file_id,
                    "question": question_text,
                    "answer": combined_answer,
                    "disease_name": q_data.get("disease_name", {}).get("kor", ""),
                    "intention": q_data.get("intention", ""),
                    "combined_text": combined_text # ⭐️ DB 생성을 위한 핵심 텍스트
                }
                merged_data.append(new_entry)

            except Exception as e:
                print(f"\n오류: 파일 처리 중 문제 발생 (ID: {file_id}): {e}")
        else:
            missing_answers += 1

    # 6. 최종적으로 합쳐진 데이터를 하나의 JSON 파일로 저장합니다.
    print(f"\n병합 완료. 총 {len(merged_data)}개의 Q/A 세트가 생성되었습니다.")
    if missing_answers > 0:
        print(f"경고: 짝이 되는 답변을 찾지 못한 질문이 {missing_answers}개 있었습니다.")

    # 출력 디렉터리가 없으면 생성
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, ensure_ascii=False, indent=4)

    print(f"🎉 성공! 합쳐진 데이터가 '{OUTPUT_FILE}' 파일로 저장되었습니다.")


if __name__ == "__main__":
    merge_qa_data()