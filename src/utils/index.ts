import { useRouter } from 'vue-router';

export * from './seo';

export const useRedirect = () => {
  const router = useRouter();

  const redirectTo = (route: string) => {
    router.push(route);
  };

  return { redirectTo };
};
