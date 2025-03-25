# Wordle

React(NextJs)와 typscript 로 구현된 Wordle 게임입니다.
제가 워낙 좋아하는 게임이라 유저가 직접 문제를 낼 수 있는 버전을 만들어보고 싶었습니다.

## play

![image](https://github.com/bgmin2e/classic-wordle/assets/155003690/13ce5f40-32e8-4dc2-8a33-54ecf4617d78)

위 이미지를 클릭하면 게임을 플레이할 수 있습니다.

0. 플레이어는 바로 게임을 시작하거나, 원하는 단어로 게임을 만들 수 있습니다. URL 을 복사하면 동일한 단어의 게임을 공유할 수 있습니다.
1. 플레이어는 한 번에 한 단어씩 추측할 수 있으며, 각 단어는 지정된 최대 길이 (5 글자)를 초과할 수 없습니다.
2. 플레이어는 최대 시도 횟수 (6번) 내에 단어를 맞춰야 합니다. 시도 횟수를 초과하면 게임이 종료됩니다.
3. 각 추측 단어는 외부 API 를 통해 유효성을 검사하여, 실제 존재하는 단어인지 확인합니다.
4. 입력한 글자가 정답에 포함되어 있는지 여부에 따라, 키보드의 각 키가 색상으로 표시됩니다. 맞춘 글자는 초록색, 포함되어있지만 위치가 다른 글자는 노란색, 포함되어 있지 않은 글자는 회색으로 표시됩니다.
5. 플레이어가 정답 단어를 맞추거나 최대 시도 횟수에 도달하면 게임이 종료되고, 게임 결과가 표시됩니다.

## 설치 및 실행

```
npm install
npm run dev
```

## 폴더 구조

```
src/
├── app/
│   ├── play
│   └── intro
├── components/
├── lib/
├── constants/
├── models/
└── services/
```

### components

공용으로 사용할 수 있는 디자인 컴포넌트를 위치시킨 폴더입니다.
현재 Modal, Toastbar, Keyboard가 포함되어 있습니다.

### lib

1. encryption.ts
   정답 단어를 Base64 형식으로 인코딩하고 디코딩하는 두 가지 함수를 제공합니다.

2. http.ts
   Axios를 사용하여 HTTP 요청을 쉽게 보낼 수 있는 HTTP 클라이언트를 제공합니다.

3. validate-word.ts
   주어진 단어의 유효성을 검사하기 위해 외부 API를 호출합니다. 유효성 검사 결과를 반환하거나, 오류 발생 시 오류 메시지를 반환합니다.

### hooks

1. use-internal-router.ts
   Next.js의 useRouter 훅을 사용하여 라우터 객체를 생성하고, push와 replace 메서드를 반환합니다.

2. use-local-storage.ts
   주어진 키(key)와 초기 값(initialValue)을 사용하여 로컬 스토리지에 데이터를 저장합니다. useState와 useEffect를 사용하여 로컬 스토리지와 상태를 동기화합니다.
