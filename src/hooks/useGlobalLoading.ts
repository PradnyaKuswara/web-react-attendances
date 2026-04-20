import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { GlobalLoadingAtom } from '../shared/atoms/atom';

const useGlobalLoading = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  (promiseFn: () => Promise<unknown>) => Promise<void>,
] => {
  const [loading, setLoading] = useRecoilState(GlobalLoadingAtom);
  const wrapWithLoading = useCallback(
    async (promiseFn: () => Promise<unknown>) => {
      setLoading(true);
      await promiseFn;
      setLoading(false);
    },
    [], //eslint-disable-line
  );
  return [loading, setLoading, wrapWithLoading];
};

export default useGlobalLoading;
