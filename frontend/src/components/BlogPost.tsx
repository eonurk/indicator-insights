import { useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/Footer";

const BlogPost = () => {
	const { slug } = useParams();
	const BlogContent = lazy(() => import(`@/blog/${slug}.tsx`));

	return (
		<>
			<SiteHeader />
			<Suspense fallback={<div>Loading...</div>}>
				<BlogContent />
			</Suspense>
			<SiteFooter />
		</>
	);
};

export default BlogPost;
