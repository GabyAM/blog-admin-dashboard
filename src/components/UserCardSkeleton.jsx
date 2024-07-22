import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function UserCardSkeleton() {
    return (
        <div className="user-card">
            <Skeleton
                width="44px"
                height="44px"
                borderRadius="var(--space-200)"
            ></Skeleton>
            <div className="info-section flex-col">
                <span>
                    <Skeleton width="45%"></Skeleton>
                </span>
                <span>
                    <Skeleton width="65%"></Skeleton>
                </span>
            </div>
            <div className="options-section"></div>
        </div>
    );
}
