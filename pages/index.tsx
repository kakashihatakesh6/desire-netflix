import Billboard from '@/components/Billboard';
import InfoModal from '@/components/InfoModal';
import MovieList from '@/components/MovieList';
import Navbar from '@/components/Navbar';
import useFavorites from '@/hooks/useFavorites';
import useInfoModal from '@/hooks/useInfoModal';
import useMovieList from '@/hooks/useMovieList';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react'
import { useSession } from 'next-auth/react';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

export default function Home() {
  const { data: movies = [] } = useMovieList();
  const { data: favorites = [] } = useFavorites();
  const {isOpen, closeModal} = useInfoModal();
  const { data: session, status } = useSession();
  console.log("session data =>", session, status)
 
  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal}/>
      {/* Navbar  */}
      <Navbar />
      {/* Billboard */}
      <Billboard />
      {/* List Movies */}
      <div className='pb-40'>
        <MovieList title='Trending Now' data={movies} /> 
        <MovieList title='My List' data={favorites} />
      </div>
    </>
  );
}
