import user1 from "@/assets/1.webp";
import user2 from "@/assets/2.webp";
import user3 from "@/assets/3.webp";

const StarRating = ({ rating }: { rating: number }) => {
	return (
		<div className="flex text-yellow-400">
			{[...Array(5)].map((_, i) => {
				const starValue = Math.min(Math.max(rating - i, 0), 1);
				return (
					<svg
						key={i}
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 sm:h-4 sm:w-4"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
					>
						<defs>
							<linearGradient id={`star-fill-${i}`}>
								<stop offset={`${starValue * 100}%`} stopColor="currentColor" />
								<stop offset={`${starValue * 100}%`} stopColor="transparent" />
							</linearGradient>
						</defs>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							fill={`url(#star-fill-${i})`}
							d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
						/>
					</svg>
				);
			})}
		</div>
	);
};

const SocialProof = () => {
	return (
		<div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
			<div className="flex -space-x-2">
				<img
					className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 border-white"
					src={user1}
					alt="User 1"
				/>
				<img
					className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 border-white"
					src={user2}
					alt="User 2"
				/>
				<img
					className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 border-white"
					src={user3}
					alt="User 3"
				/>
				<div className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-green-500 flex items-center justify-center text-white text-xs">
					99+
				</div>
			</div>
			<div className="flex items-center">
				<StarRating rating={4.6} />
				<span className="ml-2 text-gray-700 text-sm sm:text-base">
					from 99+ happy users
				</span>
			</div>
		</div>
	);
};

export default SocialProof;
