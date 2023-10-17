import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { auth, storage } from '../api/firebase';
import { updateProfile } from 'firebase/auth';

export default function useAvatar(userId) {
  const queryClient = useQueryClient();
  const user = auth.currentUser;

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

  // 아바타 업데이트하기
  const updateAvatar = useMutation(
    async (file) => {
      if (!user) return;

      console.log('update avatar...');
      const storageRef = ref(storage, `avatars/${userId}`);
      const result = await uploadBytes(storageRef, file);
      const avatarURL = await getDownloadURL(result.ref);
      await updateProfile(user, {
        photoURL: avatarURL,
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['avatar', userId]),
    }
  );

  return { avatarQuery, updateAvatar };
}
