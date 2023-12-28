import { Skeleton } from 'antd'
export const PageSkeleton = () => {
	const skeletonParagraph = (
		<Skeleton style={paragraphStyle} active paragraph={{ rows: 4 }} />
	)
	return (
		<>
			{skeletonParagraph} {skeletonParagraph} {skeletonParagraph}
		</>
	)
}

const paragraphStyle: React.CSSProperties = {
	paddingBottom: '40px',
}
