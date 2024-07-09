# classic-wordle

find 5 letter word

# Wordle

React(NextJs)와 typscript 로 구현된 Wordle 게임입니다.
CSS는 tailwind와 classnames 라이브러리를 사용했습니다.

## 설치

```
npm install
npm run dev
```

## 폴더 구조

<img width="174" alt="스크린샷 2024-05-26 오전 12 01 16" src="https://github.com/buzzvil-assignments/bgmin2e-gmail.com/assets/155003690/2c4a9aaa-4e00-4dbc-a0fe-ff0c9bf52fbf">

### components

공용으로 사용할 수 있는 디자인 컴포넌트를 위치시킨 폴더입니다.
현재 Modal, Toastbar, Keyboard가 구현되어 있습니다.

### constants

상수 변수를 모아둔 폴더입니다.
localStorageKey, searchParams, initialValue 등의 변수를 관리합니다.

### models

wordle 의 단어 state 를 관리할 때 사용되는 type 또는 interface 입니다.

### utils

여러 컴포넌트에서 공용으로 사용될만한 공용 로직을 분리해둔 폴더 입니다.
단순 util 성 함수와 react hook이 포함되어 있습니다.
현재는 word encryption, validateWord, useLocalStorage 등이 구현되어 있습니다.
