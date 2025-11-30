import { useRouter } from 'vue-router';

export * from './seo';
export * from './date';
export * from './fonts';
export * from './validation';

export const useRedirect = () => {
  const router = useRouter();

  const redirectTo = (route: string) => {
    router.push(route);
  };

  return { redirectTo };
};
