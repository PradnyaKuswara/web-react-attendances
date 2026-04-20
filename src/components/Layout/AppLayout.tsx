import React from 'react';
import GlobalLoading from '../GlobalLoading';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const ref = useRef<any>(null);
  // const setTopbar = useSetRecoilState(TopbarControlAtom);

  // useEffect(() => {
  //   setTopbar({
  //     start: () => ref.current?.continuousStart(),
  //     complete: () => ref.current?.complete(),
  //   });
  // }, [setTopbar]);

  return (
    <>
      <GlobalLoading />
      <main className="min-h-screen">{children}</main>
    </>
  );
};

export default AppLayout;
