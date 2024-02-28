const btnContainer = document.getElementById('btn-container');
const cardContainer = document.getElementById('vid-container');
const error = document.getElementById('error');

let selectedCategory = 1000;

const fetchCategories = () =>{
    const url = 'https://openapi.programming-hero.com/api/videos/categories'
    fetch(url)
    .then( res => res.json())
    .then( data =>{
        data.data.forEach((element) => {
            const newBtn = document.createElement('button');
            newBtn.innerText = element.category;
            newBtn.classList.add('btn','btn-error');
            newBtn.addEventListener('click', ()=> fetchDataByCategories(element.category_id));
            btnContainer.appendChild(newBtn);
        })
    } )
}

const fetchDataByCategories = (categoryID) =>{
    selectedCategory = categoryID;
    const url = `https://openapi.programming-hero.com/api/videos/category/${categoryID}`
    fetch(url)
    .then( res => res.json())
    .then( data =>{
        if(data.data.length ===0){
            error.classList.remove('hidden');
        }
        else{
            error.classList.add('hidden');
        }
        cardContainer.innerHTML = '';
        data.data.forEach(video => {
            let verifiedTik = '';
            if(video.authors[0].verified){
                verifiedTik = `<img src="images/tik.png" alt="verified badge" class="w-6">`;
            }
            const newCard = document.createElement('div');
            newCard.innerHTML = `
            <div class="card w-full bg-base-100 shadow-xl">
            <figure class="overflow-hidden h-72">
                    <img src=" ${video.thumbnail} " alt="" class="w-full h-full">
                    <h6 class="absolute bottom-[40%] right-12">0 hr</h6>
            </figure>
            <div class="card-body">
                <div class="flex space-x-4 justify-start items-start">
                    <div>
                        <img src="${video.authors[0].profile_picture}" alt="" class="w-12 h-12 rounded-full">
                    </div>
                    <div>
                        <h2 class="card-title">${video.title}</h2>
                        <div class="flex justify-between mt-3">
                            <p class="">${video.authors[0].profile_name}</p>
                            ${verifiedTik}
                        </div>
                        <p class="mt-3">${video.others.views}</p>
                </div>
            </div>
        </div>
            `
        cardContainer.appendChild(newCard);

        })
    })
}


fetchCategories();
fetchDataByCategories(selectedCategory);
