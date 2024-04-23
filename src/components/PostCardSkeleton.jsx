import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function PostCardSkeleton() {
    return (
        <div className="post-card">
            <div className="post-thumbnail">
                <Skeleton width="100%" height="100%"></Skeleton>
            </div>
            <div className="text-section flex-col">
                <h2>
                    <Skeleton></Skeleton>
                </h2>
                <p>
                    <Skeleton count={3}></Skeleton>
                </p>
            </div>
        </div>
    );
}
