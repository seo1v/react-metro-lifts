# 🦽 교통약자를 위한 앱, 'Wherever' 프로젝트

![thumbnail](https://github.com/cona-tus/react-metro-lifts/assets/90844424/3dc57269-c056-473e-b887-0a60b5fe5dcd)

<br/>

🔗 Wherever [[Live Demo](https://react-metro-lifts.web.app/)]

<br/>
<br/>

## 1. Project

### 1-1. Project Description

웨어에버 프로젝트는 교통약자를 대상으로 기획되었습니다. 서울교통공사의 API를 활용하여 사용자들에게 지하철 역마다 설치된 승강기의 위치 정보를 제공합니다. 뿐만 아니라, 휠체어 이용자들이 접근 가능한 장소를 서로 공유하고 소통할 수 있도록 파이어 베이스를 이용한 소셜 미디어 기능을 구현했습니다.

모두가 자유롭고 안전한 이동권을 보장받길 바랍니다.

<br/>

## 1-2. Project Duration & Participants

- 2023-10-2 ~ 2023-10-15
- 개인 프로젝트 (1인)

<br/>
<br/>

## 2. Skills

![JAVASCRIPT](https://img.shields.io/badge/JavaScript-f6e158?style=for-the-badge&logo=JavaScript&logoColor=ffffff)
![REACT](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=ffffff)
![POSTCSS](https://img.shields.io/badge/Postcss-DD3A0A?style=for-the-badge&logo=postcss&logoColor=ffffff)
![Git](https://img.shields.io/badge/Git-f05032?style=for-the-badge&logo=git&logoColor=ffffff)
![Firebase](https://img.shields.io/badge/Firebase-FFCB2D?style=for-the-badge&logo=firebase&logoColor=ffffff)

<br/>
<br/>

## 3. Pages

1. Sign Up - 회원가입 페이지('/signup')
2. Sign In - 로그인 페이지('/signin')
3. Home - 메인 페이지('/')
4. Feed - 피드 페이지('/feed')
5. Profile - 프로필 페이지('profile')
6. NotFound - 404 페이지

<br/>

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        path: '/',
        element: <Home />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/feed',
        element: <Feed />,
      },
    ],
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
]);
```

<br/>
<br/>

## 4. Main Features

1. [회원가입](#4-1-register-account)
2. [로그인 및 로그아웃](#4-2-sign-in--sign-out)
3. [서울교통공사 API를 이용한 승강기 정보 검색](#4-3-search-lifts-info)
4. [파이어베이스를 이용한 피드 구현](#4-4-show-messages)
5. [메시지 생성](#4-5-create-message)
6. [메시지 수정](#4-6-edit-message)
7. [메시지 삭제](#4-7-delete-message)
8. [프로필 이름 및 사진 변경](#4-8-update-profile)

<br/>

### 4-1. Register Account

![register](https://github.com/cona-tus/react-metro-lifts/assets/90844424/a51fe969-3e36-40e3-8582-4e754fa96bfd)

회원가입을 구현하기 위해 파이어 베이스의 Authentication 기능을 활용합니다. 사용자가 입력한 정보를 `createUserWithEmailAndPassword` 메서드에 전달하면, 해당 정보를 기반으로 사용자를 등록합니다. 또한 가입과 동시에 `updateProfile` 메서드를 사용하여 사용자의 기본 프로필을 설정합니다.

```jsx
import { getAuth } from 'firebase/auth';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const auth = getAuth(app);

const onSubmit = async (data) => {
  setError('');

  try {
    setIsLoading(true);

    // 계정 생성
    const credentials = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // 사용자 기본 프로필 설정
    await updateProfile(credentials.user, {
      displayName: data.username,
      photoURL: process.env.REACT_APP_DEFAULT_AVATAR,
    });

    // Home으로 이동
    navigate('/');
  } catch (e) {
    // 에러 처리
    setError(
      e.code === 'auth/email-already-in-use'
        ? '이미 존재하는 이메일입니다.'
        : e.code
    );
  } finally {
    setIsLoading(false);
  }
};
```

<br/>
<br/>

### 4-2. Sign In & Sign Out

![login](https://github.com/cona-tus/react-metro-lifts/assets/90844424/422d5533-52f8-4174-89f2-cd18a5f5ad90)

사용자는 자신의 이메일 주소와 비밀번호를 입력하여 로그인할 수 있습니다. 사용자가 입력한 정보를 `signInWithEmailAndPassword` 메서드로 전달합니다.

```jsx
import { getAuth } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(app);

const onSubmit = async (data) => {
  setError('');

  try {
    setIsLoading(true);

    // 로그인
    await signInWithEmailAndPassword(auth, data.email, data.password);

    // Home으로 이동
    navigate('/');
  } catch (e) {
    // 에러 처리
    setError(
      e.code === 'auth/invalid-login-credentials'
        ? '유효하지 않은 이메일 또는 비밀번호입니다.'
        : e.code
    );
  } finally {
    setIsLoading(false);
  }
};
```

<br/>

![logout](https://github.com/cona-tus/react-metro-lifts/assets/90844424/e58e3a21-b03c-4967-a0fb-232ce9c56cd9)

`signOut`을 호출하여 사용자를 로그아웃시킬 수 있습니다.

```jsx
const auth = getAuth(app);

// 로그아웃
const onSignOut = () => {
  const ok = window.confirm('로그아웃 하시겠습니까?');

  if (ok) {
    auth.signOut();
    navigate('/signin');
  }
};
```

<br/>
<br/>

### 4-3. Search Lifts Info

![search](https://github.com/cona-tus/react-metro-lifts/assets/90844424/e3be4039-3185-410c-ba94-aebfe51cc2cd)

서울교통공사에서 제공하는 API를 활용해 지하철 승강기 데이터를 가져옵니다. 한 번에 요청할 수 있는 데이터 수는 1000개이므로 데이터의 범위(startItem/endItem)를 설정합니다. `while` 루프를 사용해 데이터를 연속적으로 가져오며, 데이터 수가 1000보다 작다면 루프를 탈출합니다. 받아온 모든 데이터를 `allData` 배열에 추가하여 반환합니다.

```js
import axios from 'axios';

export async function getLocations() {
  const allData = [];
  const ITEMS_PER_PAGE = 1000;
  let page = 1;

  try {
    while (true) {
      const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
      const endItem = page * ITEMS_PER_PAGE;

      const res = await axios.get(
        `http://openapi.seoul.go.kr:8088/${process.env.REACT_APP_METRO_API_KEY}/json/SeoulMetroFaciInfo/${startItem}/${endItem}`
      );

      const data = res.data.SeoulMetroFaciInfo.row || [];

      allData.push(...data);

      if (data.length < ITEMS_PER_PAGE) {
        break;
      }

      page++;
    }

    return allData.map((item) => ({ ...item, id: uuid() }));
  } catch (e) {
    console.log('문제가 발생했습니다.');
  }
}
```

<br/>

네트워크 요청을 최소화하고 앱의 성능을 향상시키기 위해 React Query를 사용합니다. `useQuery` 훅으로 locations 데이터를 불러오고 캐싱합니다. `staleTime` 옵션으로 데이터 유효 시간을 설정하며, 10분마다 데이터를 갱신합니다.

```jsx
export default function Home() {
  const {
    isLoading,
    error,
    data: locations,
  } = useQuery(['locations'], getLocations, {
    staleTime: 1000 * 60 * 10,
  });

// ...
```

<br/>

`handleFind` 함수는 검색어(keyword)와 역 정보(stations)를 받아서 검색어와 일치하는 역 정보를 필터링하여 반환합니다.

```jsx
const [text, setText] = useState('서울역');
const [filteredStations, setFilteredStations] = useState([]);

const handleFind = (keyword, stations) => {
  const regex = new RegExp(keyword, 'gi');

  return stations.filter((station) => station.station_nm.match(regex));
};

// ...
```

<br/>

useEffect 훅을 사용해 사용자가 입력한 검색어와 locations가 변경될 때마다 검색어와 매치되는 역 정보를 찾고, 이를 `filteredStations` 상태에 업데이트합니다.

```jsx
  useEffect(() => {
    if (locations) {
      const matchArr = handleFind(text, locations) || [];
      setFilteredStations(matchArr);
    }
  }, [text, locations]);
};
```

<br/>

`map` 메서드를 사용해 `filteredStations` 배열의 각 항목을 순회하면서 `<ul>` 요소 내에 동적으로 렌더링 합니다.

```jsx
{
  filteredStations && (
    <ul>
      {filteredStations.map((station) => (
        <LocationCard key={station.id} station={station} />
      ))}
    </ul>
  );
}
```

<br/>
<br/>

### 4-4. Show Messages

![feed](https://github.com/cona-tus/react-metro-lifts/assets/90844424/46eab9e4-9b68-4b49-9b87-986c24e26374)

Cloud Firestore로 실시간 업데이트를 구현할 수 있습니다. `onSnapshot` 메서드로 문서를 리슨하며 메시지 데이터를 가져오고, 해당 데이터가 변경될 때마다 messages 상태를 업데이트하여 렌더링 합니다.

```jsx
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../api/firebase';

export default function TimeLine() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let unsubscribe = null;

    // 쿼리 생성
    const fetchMessages = async () => {
      const messageQuery = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );

      // 스냅샷 업데이트
      unsubscribe = await onSnapshot(messageQuery, (snapshot) => {
        const messages = snapshot.docs.map((doc) => {
          const { message, createdAt, userId, username, photo, avatar } =
            doc.data();

          return {
            message,
            createdAt,
            userId,
            username,
            photo,
            avatar,
            id: doc.id,
          };
        });
        // 메시지 데이터를 state에 업데이트
        setMessages(messages);
      });
    };
    fetchMessages();

    // 파이어베이스 리스너 등록을 해제
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  // ...
}
```

<br/>

`map` 메서드를 사용해 `messages` 배열의 각 항목을 순회하면서 `<ul>` 요소 내에 동적으로 렌더링 합니다. 이때 props로 message를 전달합니다.

```jsx
return (
  <ul className={styles.messages}>
    {messages.map((message) => (
      <Message key={message.id} info={message} />
    ))}
  </ul>
);
```

<br/>
<br/>

### 4-5. Create Message

![create](https://github.com/cona-tus/react-metro-lifts/assets/90844424/9ea5006b-abdf-4dc0-9710-4c799faebd50)

사용자는 메시지를 작성하거나 사진을 업로드하여 콘텐츠를 게시할 수 있습니다. 이를 위해 `addDoc` 메서드를 사용하여 Cloud Firestore에 데이터를 추가합니다. 파일이 첨부된 경우, 해당 파일을 Cloud Storage에 업로드합니다. 메시지 삭제 시, 연결된 파일도 삭제하기 위해 경로에 `doc.id`를 사용합니다. 이후 `updateDoc` 메서드로 문서에 사진과 아바타를 등록합니다.

```jsx
import { auth, db, storage } from '../api/firebase';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function PostForm() {
  // ...
  const {
    avatarQuery: { isLoading: isAvatarLoading, error, data: avatar },
  } = useAvatar(user.uid);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || isMessageLoading || message === '' || message.length > 120)
      return;

    try {
      setIsMessageLoading(true);

      // firestore에 데이터 추가
      const doc = await addDoc(collection(db, 'messages'), {
        message,
        createdAt: Date.now(),
        username: user.displayName || 'Anonymous',
        userId: user.uid,
      });

      // storage에 파일 업로드
      if (file) {
        const storageRef = ref(storage, `messages/${user.uid}/${doc.id}`);
        const result = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(result.ref);

        // 문서에 photo 필드 추가
        await updateDoc(doc, {
          photo: url,
        });
      }

      if (avatar) {
        // 문서에 avatar 필드 추가
        await updateDoc(doc, {
          avatar,
        });
      }

      setMessage('');
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setIsMessageLoading(false);
    }
  };
  // ...
}
```

<br/>
<br/>

### 4-6. Edit Message

![edit](https://github.com/cona-tus/react-metro-lifts/assets/90844424/1448d152-c20f-4076-8f95-57c5cd230743)

사용자는 게시된 메시지 내용을 수정할 수 있습니다. 현재 사용자(auth.currentUser)가 메시지 작성자인 경우에만 수정할 수 있도록 `user && user.uid === userId`로 제한합니다. `updateDoc` 메서드를 호출하여 수정된 내용으로 메시지를 업데이트합니다.

```jsx
import { auth, db } from '../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Message({
  info: { username, photo, message, userId, id, createdAt, avatar },
}) {
  const user = auth.currentUser;
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');

  // 수정된 메시지 값을 text에 저장
  const handleMessageChange = (e) => {
    setText(e.target.value);
  };

  // 작성글 수정
  const handleEdit = async () => {
    setShowMenu(false);

    if (!isEditing || (user && user.uid !== userId)) return;

    try {
      if (text === '' || text.length > 120) return;

      // 메시지 필드 업데이트
      await updateDoc(doc(db, 'messages', id), {
        message: text,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsEditing(!isEditing);
      setText('');
    }
  };

  //...
}
```

<br/>
<br/>

### 4-7. Delete Message

![delete](https://github.com/cona-tus/react-metro-lifts/assets/90844424/51c28530-ee64-442f-882a-6a4849d8ad67)

메시지를 삭제하려면 `deleteDoc` 메서드를 사용합니다. 또한 업로드된 사진이 있다면 `deleteObject` 메서드를 호출하여 함께 삭제합니다.

```jsx
import { db, storage } from '../api/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

// 작성글 삭제
const handleDelete = async () => {
  setShowMenu(false);

  const ok = window.confirm('정말 삭제하시겠습니까?');
  if (!ok || (user && user.uid !== userId)) return;

  try {
    // firestore에서 id에 해당하는 데이터 삭제
    await deleteDoc(doc(db, 'messages', id));

    // storage에서 id에 해당하는 사진 삭제
    if (photo) {
      const photoRef = ref(storage, `messages/${user.uid}/${id}`);
      await deleteObject(photoRef);
    }
  } catch (e) {
    console.log(e);
  } finally {
    setShowMenu(false);
  }
};
```

<br/>
<br/>

### 4-8. Update Profile

![update-avatar](https://github.com/cona-tus/react-metro-lifts/assets/90844424/812ea6a0-9c05-488a-bdb5-8853285a7b7c)

Profile 페이지에서 사용자는 자신의 아바타를 변경할 수 있습니다. 아바타는 `useAvatar`라는 커스텀 훅으로 관리합니다. 이 훅은 userId를 받아와 아바타를 가져오고 업데이트하는 데 사용됩니다.

`uploadBytes` 메서드와 `getDownloadURL` 메서드를 통해 Firebase Storage에 파일을 업로드하고 URL을 가져옵니다. `updateProfile` 메서드를 호출하여 user의 photoURL를 업데이트합니다. React Query의 useMutation 훅을 사용해 아바타 변경이 성공하면 `invalidateQueries`를 통해 avatar 쿼리 캐시를 무효화하고 최신 데이터를 사용할 수 있도록 합니다.

```jsx
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../api/firebase';
import { updateProfile } from 'firebase/auth';

export default function useAvatar(userId) {
  const queryClient = useQueryClient();
  const user = auth.currentUser;

  // ...

  // 아바타 업데이트하기
  const updateAvatar = useMutation(
    async (file) => {
      if (!user) return;

      // 업로드한 파일의 URL로 아바타 변경
      const storageRef = ref(storage, `avatars/${userId}`);
      const result = await uploadBytes(storageRef, file);
      const avatarURL = await getDownloadURL(result.ref);
      await updateProfile(user, {
        photoURL: avatarURL,
      });
    },
    {
      // 아바타 쿼리 캐시 무효화
      onSuccess: () => queryClient.invalidateQueries(['avatar', userId]),
    }
  );

  return { avatarQuery, updateAvatar };
}
```

<br/>

![change-name](https://github.com/cona-tus/react-metro-lifts/assets/90844424/a72098be-ef0d-4865-ad79-c4cf7f39d96e)

사용자는 자신의 이름을 변경할 수 있습니다. 입력 값을 changedName 상태에 저장하며, 정규 표현식(regex)을 사용해 유효성 검사를 합니다. 검사 후 `updateProfile` 메서드를 호출하여 현재 사용자(auth.currentUser)의 displayName을 업데이트합니다.

```jsx
export default function Profile() {
  const user = auth.currentUser;
  const [changedName, setChangedName] = useState(
    user?.displayName ?? 'Anonymous'
  );

  // 입력한 값을 changedName 저장
  const onNameChange = (e) => {
    setChangedName(e.target.value);
  };

  // 이름 수정
  const handleNameEdit = async () => {
    if (!user || !isEditing) return;

    const regex = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){1,8}[a-zA-Z0-9]$/;

    if (!regex.test(changedName.trim())) {
      return alert(
        '이름은 영문 대소문자, 숫자, 점(.), 밑줄(_), 하이픈(-)으로 구성된 3자 이상 10자 이내여야 합니다.'
      );
    }

    try {
      await updateProfile(user, {
        displayName: changedName,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsEditing(false);
    }
  };

  // ...
}
```

<br/>
<br/>

## 5. UI/UX

## 5-1. Control Tab Focus

![focus](https://github.com/cona-tus/react-metro-lifts/assets/90844424/c24b833d-9363-4999-92ab-bc7012c2811a)

웨어에버 웹 사이트는 웹 접근성을 향상시키기 위해 시맨틱 태그를 사용합니다. 뿐만 아니라, 키보드의 탭(Tab) 키만을 이용해 웹을 탐색할 수 있도록 합니다. 사용자는 탭 키를 눌러 메뉴 또는 본문으로 건너뛰기 할 수 있습니다.

<br/>
<br/>

### 5-2. Scroll To Top

![scroll](https://github.com/cona-tus/react-metro-lifts/assets/90844424/a1efe7a4-d516-4f82-8c4c-e90bbe393e07)

사용자의 편의를 위해 스크롤 한 후 페이지 상단으로 쉽게 이동할 수 있도록 합니다.

<br/>
<br/>

### 5-3. Display User guidance Message

![guide](https://github.com/cona-tus/react-metro-lifts/assets/90844424/3de4aacd-deab-43db-98cc-35066742a75c)

입력한 값이 유효한지 사용자에게 안내 메시지를 보여줍니다. 사용자에게 즉각적인 피드백을 제공함으로써 사용자 경험을 향상시킬 수 있습니다.

<br/>
<br/>

### 5-4. Responsive Web Design

![responsive](https://github.com/cona-tus/react-metro-lifts/assets/90844424/ac0b4df1-5e4e-4bcd-98db-e433eb37633c)

웨어에버는 반응형 웹 사이트입니다. 다양한 디바이스와 화면 크기에 웹 사이트가 올바르게 표시됩니다. 이로써 사용자가 웹 사이트를 더 편리하게 이용할 수 있도록 합니다.

<br/>
<br/>

## 6. Trouble shooting

### 6-1. Render Avatars

![avatar-render](https://github.com/cona-tus/react-metro-lifts/assets/90844424/09f530fa-95c6-4e9c-837d-451991773d52)

#### 1. 목표

피드에 표시되는 각 메시지마다 작성자의 아바타가 보이도록 만들고자 했습니다.

<br/>

#### 2. 문제 상황

아바타를 렌더링 하려면 사용자의 아바타 이미지 URL을 불러와야 합니다. 이를 위해 React Query를 사용해 아바타를 캐싱했습니다. 그러나 각 메시지마다 아바타를 표시해야 하므로 사용자 수만큼 쿼리와 캐시가 생성되어 중복되었습니다.

<br/>

#### 3. 해결 방법

불필요한 캐싱을 방지하기 위해 `useAvatar`라는 훅을 만들었습니다. 이 훅은 아바타를 가져오고 업데이트하는 데 사용됩니다. 이를 통해 현재 로그인된 사용자의 아바타 쿼리만 생성하고 캐시할 수 있었습니다.

```jsx
// 아바타 불러오기
const avatarQuery = useQuery(
  ['avatar', userId],
  async () => {
    if (!userId) return process.env.REACT_APP_DEFAULT_AVATAR;

    try {
      const avatarRef = ref(storage, `avatars/${userId}`);
      const url = await getDownloadURL(avatarRef);
      return url;
    } catch (e) {
      console.log(e);
      return process.env.REACT_APP_DEFAULT_AVATAR;
    }
  },
  {
    staleTime: 1000 * 60 * 60,
  }
);
```

사용자가 메시지를 작성할 때, 아바타 쿼리를 가져와 Firestore message 문서의 avatar 필드에 할당하였습니다. 이로써 메시지 자체에 아바타 정보가 포함되었습니다.

이렇게 함으로써 아바타를 효율적으로 관리하고 각 메시지에 아바타를 렌더링 할 수 있게 되었습니다.

<br/>
<br/>

### 6-2. Tab key Focus Issue

![tab](https://github.com/cona-tus/react-metro-lifts/assets/90844424/14c0e237-93a9-4502-b69f-9cbb08f4efb2)

#### 1. 목표

웹 페이지를 키보드 탭(tab) 키만을 사용하여 탐색 가능하도록 만들고자 했습니다. 디자인상 input(tpye=file, submit)의 기본 스타일을 무시하고 label 요소를 사용하여 커스터마이징하려 했습니다.

```jsx
        <div className={styles.upload}>
          <input
            type='file'
            id='file'
            accept='image/*'
            onChange={handleFileChange}
          />
          <label htmlFor='file' className={styles.button}>
            {file ? <BiCheck /> : <BiSolidPhotoAlbum />}
          </label>
        </div>
        <div className={styles.post}>
          <input id='submit' type='submit' />
          <label htmlFor='submit' className={styles.button}>
            {isMessageLoading ? <BiLoader /> : <BiPlus />}
          </label>
        </div>
```

<br/>

#### 2. 문제 상황

tabindex 속성을 적용하더라도 탭 키만으로 label 요소가 자동으로 포커싱 되지 않았습니다.

<br/>

#### 3. 해결 방법

CSS를 활용하여([참고](https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/)) input 요소를 시각적으로 화면에 표시되지 않도록 숨겼습니다. 또한 input 요소가 포커스를 받으면 label 요소를 시각적으로 스타일링하여 사용자가 인식할 수 있도록 만들었습니다. 이렇게 하여 label 요소에 포커스가 받는 것처럼 사용자와 상호작용할 수 있습니다.

```css
.upload,
.post {
  position: relative;
}

.upload input[type='file'],
.post input[type='submit'] {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.upload input[type='file']:focus + label,
.post input[type='submit']:focus + label {
  outline: 2px solid var(--color-focus);
}
```

<br/>
<br/>

[맨위로 이동하기](#-교통약자를-위한-앱-wherever-프로젝트)

<br/>
