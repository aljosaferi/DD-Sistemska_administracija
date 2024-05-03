function Photo(props){
    return (
        <div className="card bg-dark text-dark mb-2">
            <img className="card-img" src={"http://20.52.166.76:3001/"+props.photo.path} alt={props.photo.name}/>
            <div className="card-img-overlay">
                <h5 className="card-title">{props.photo.name}</h5>
            </div>
        </div>
    );
}

export default Photo;