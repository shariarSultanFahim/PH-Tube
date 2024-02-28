const btnContainer = document.getElementById('btn-container');
const cardContainer = document.getElementById('vid-container');
const error = document.getElementById('error');
const sortBtn = document.getElementById('sort-btn');

let selectedCategory = 1000;
let sorted = false;


sortBtn.addEventListener('click' , ()=>{
    sorted?sorted=false:sorted=true;
    fetchDataByCategories(selectedCategory,sorted);
    sorted?sortBtn.classList.add('btn-error'):sortBtn.classList.remove('btn-error');
})

const fetchCategories = () =>{
    const url = 'https://openapi.programming-hero.com/api/videos/categories'
    fetch(url)
    .then( res => res.json())
    .then( data =>{
        data.data.forEach((element) => {
            const newBtn = document.createElement('button');
            newBtn.innerText = element.category;
            newBtn.classList.add('btn', 'allBtns');
            newBtn.addEventListener('click', ()=> {
                fetchDataByCategories(element.category_id , sorted)
                const allBtn = document.querySelectorAll('.allBtns');
                for(const btn of allBtn ){
                    btn.classList.remove('btn-error');
                }
                newBtn.classList.add('btn-error');
            });
            btnContainer.appendChild(newBtn);
        })
    } )
}

const fetchDataByCategories = (categoryID , sortByView) =>{
    selectedCategory = categoryID;
    const url = `https://openapi.programming-hero.com/api/videos/category/${categoryID}`
    fetch(url)
    .then( res => res.json())
    .then( data =>{
        if(sortByView){
            data.data.sort((a,b) =>{
                const totalViewsStrFirst = a.others?.views;
                const totalViewsStrSecond = b.others?.views;
                const totalViewFirstNumber = parseFloat(totalViewsStrFirst.replace("K",'') || 0);
                const totalViewSecondNumber = parseFloat(totalViewsStrSecond.replace("K",'') || 0);
                return totalViewSecondNumber-totalViewFirstNumber;
            })
        }

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

            let milliseconds = video.others.posted_date;
            let hours = Math.floor(Math.floor (Math.floor(milliseconds / 1000)/60 )/60);
            let minutes = Math.floor (Math.floor(milliseconds / 1000)/60 );
            let postedTime = '';
            if(hours!=0 || minutes!=0){
                 postedTime = `${hours} Hours ${minutes} Minutes Ago`;
            }
                
            
            

            const newCard = document.createElement('div');
            newCard.innerHTML = `
            <div class="card w-full bg-base-100 shadow-xl">
            <figure class="overflow-hidden h-72">
                    <img src=" ${video.thumbnail} " alt="" class="w-full h-full">
                    <h6 class="absolute bottom-[40%] right-12 text-white px-1 bg-black rounded-lg">${postedTime} </h6>
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
fetchDataByCategories(selectedCategory, sorted);
