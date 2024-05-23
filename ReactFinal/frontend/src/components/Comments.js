function Comments({ comments }){

    const calculateTimeAgo = (dateCreated) => {
        const datePosted = new Date(dateCreated);
        const now = new Date();
        const secondsAgo = Math.floor((now - datePosted) / 1000);

        if (secondsAgo < 60) {
            return `${secondsAgo} seconds ago`;
        } else if (secondsAgo < 3600) {
            return `${Math.floor(secondsAgo / 60)} minutes ago`;
        } else if (secondsAgo < 86400) {
            return `${Math.floor(secondsAgo / 3600)} hours ago`;
        } else {
            return `${Math.floor(secondsAgo / 86400)} days ago`;
        }
    }

    return (
        <div>
            {comments.map((comment, index) => (
                <div key={index}>
                    <p><b>{comment.postedBy.username}</b> {comment.body}</p>
                    <p style={{marginTop: '-25px', fontSize: '0.8em'}}>{calculateTimeAgo(comment.dateCreated)}</p>
                </div>
            ))}
        </div>
    )
}

export default Comments;