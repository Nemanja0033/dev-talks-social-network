import { collection, getDocs, query, orderBy} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { db } from '../../firebaseconfig';
import PostCard from '../post/PostCard';
import { useAnimation } from '../../helpers/useAnimation';
import Sidebar from '../nav/Sidebar';
import { useAuth } from '../../context/authContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Feed = () => {
  const { isAuth } = useAuth()
  const [postList, setPostList] = useState<any[]>([]);
  const feedRef = useRef<HTMLDivElement | null>(null);

  const postsCollectionRef = collection(db, "posts");

  useEffect(() => {
    const getPosts = async () => {
      const q = query(postsCollectionRef, orderBy("createdAt", "desc"));
      const data = await getDocs(q);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  }, [postList]); 

  useAnimation(feedRef);

  return (
    <div className='flex justify-start'>
      <Sidebar />
      <div ref={feedRef} className='flex justify-center md:w-1/2 w-full'>
        <div className='flex-row w-full h-full md:mt-6 mt-0  bg-white rounded-md shadow-md'>
          {!isAuth ? (
            <div className='flex gap-3 justify-center md:mt-3 mt-12'>
              <h1 className='text-center font-semibold text-2xl'>Login to explore more features</h1>
              <Link to={'/login'}>
                <button className="btn btn-sm btn-neutral">Login <ArrowRight /></button>
              </Link>

            </div>
          )
          :
          (
            <h1 className='text-center font-semibold text-2xl'>Home</h1>
          )
        }
          {postList.length == 0 ? (
            <div className='flex justify-center'>
             <span className="loading loading-spinner loading-md"></span>
            </div>
          )
          :
          (
            postList.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                postData={post.postData}
                author={post.author.name}
                date={post.date.toString()}
                likes={post.likes}
                authorID={post.author.id}
              />
            ))
          )
        }
        </div>
      </div>
    </div>
  );
};

export default Feed;
