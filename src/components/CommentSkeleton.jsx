import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function CommentSkeleton() {
    return (
        <div className={`comment-container-wrapper flex-col`}>
            <h3>
                <Skeleton width="80%"></Skeleton>
            </h3>
            <div className="flex-col">
                <div className="comment-container flex-col">
                    <div className="comment">
                        <div className="image-container">
                            <Skeleton
                                borderRadius={'var(--space-200)'}
                                height="44px"
                            ></Skeleton>
                        </div>
                        <div className="comment-text">
                            <span>
                                <Skeleton width="30%"></Skeleton>
                            </span>
                            <p className="comment-content">
                                <Skeleton count={3}></Skeleton>
                            </p>
                        </div>
                        <div className="comment-options-section"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
