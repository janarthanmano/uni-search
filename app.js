checkSaved(null)


function checkSaved(ele){

	//toggle save and delete button
	if(ele !== null){
		if(ele.dataset.type === 'save'){
			ele.classList.add('is-hidden');
			ele.closest('.actions').querySelector('.deleteUni').classList.remove("is-hidden");
		}else{
			ele.classList.add('is-hidden');
			ele.closest('.actions').querySelector('.saveUni').classList.remove("is-hidden");
		}
	}else{
		//query all saved unis on first load
		let  savedUniversities = JSON.parse(localStorage.getItem('university'));
		query(savedUniversities)
	}
}

/*
function to query saved unis
 */
async function query(savedUniversities) {
	const universities = "http://universities.hipolabs.com/search?country=United+kingdom";
	const results = await (await fetch(universities)).json()

	const lowercaseSavedUniversities = savedUniversities.map(item => item.toLowerCase())

	//Fixed duplicate result returned from source.
	const cleanResults = results.filter((results, index, self) =>
		index === self.findIndex((t) => (t.alpha_two_code === results.alpha_two_code && t.name === results.name)))

	//Fixed case-sensitive search
	const foundUniversities = cleanResults.filter(item => lowercaseSavedUniversities.includes(item.name.toLowerCase()))
	displayUniversities(foundUniversities);
}

async function search(event){

	const searchTerm = event.target.value;

	const universities = "http://universities.hipolabs.com/search?country=United+kingdom";
	const results = await (await fetch(universities)).json()

	//Fixed duplicate result returned from source.
	const cleanResults = results.filter((results, index, self) =>
		index === self.findIndex((t) => (t.alpha_two_code === results.alpha_two_code && t.name === results.name)))

	//Fixed case-sensitive search
	const foundUniversities = cleanResults.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
	displayUniversities(foundUniversities, 20)

	//fix empty result on clearing the search input field.
	if(searchTerm == ''){
		displayUniversities([])
	}
}

function displayUniversities(foundUniversities, size = 0){
	//limit search result to size.
	if(size > 0){
		document.getElementById("results").innerHTML = foundUniversities.slice(0, size).map(formatUniversity).join("");
	}else{
		document.getElementById("results").innerHTML = foundUniversities.map(formatUniversity).join("");
	}
}

function formatUniversity(university){

	//Add domain info.
	const allDomains = university.domains;

	//fomatting domains
	let domains = '';
	if(allDomains.length > 1){
		domains = domains + '<div><title>URLs</title><ul>'
		allDomains.forEach(function(domain){
			domains = domains + '<li class="my-2"><a href="'+domain+'" target="_blank">'+domain+'</a></li>'
		});
		domains = domains + '</ul></div>'
	}else{
		domains = '<div><title>URLs</title><ul><li><a href="'+university.domains+'" target="_blank">'+university.domains+'</a></li></ul></div>'
	}

	//generating save and delete buttons
	let  savedUniversities = JSON.parse(localStorage.getItem('university'));
	let saved = '<div><button class="button" onclick="saveUniversity(this, \''+university.name+'\')">Save</button></div>';

	if(savedUniversities !== null) {
		const index = savedUniversities.indexOf(university.name);
		if (index > -1) {
			saved = '<div class="actions"><div><button class="button deleteUni" data-type="delete" onclick="deleteUniversity(this, \''+university.name+'\')">Delete</button></div>' +
				'<div><button class="button is-hidden saveUni" data-type="save" onclick="saveUniversity(this, \''+university.name+'\')">Save</button></div></div>';
		}else{
			saved = '<div class="actions"><div><button class="button is-hidden deleteUni" data-type="delete" onclick="deleteUniversity(this, \''+university.name+'\')">Delete</button></div>' +
				'<div><button class="button saveUni" data-type="save" onclick="saveUniversity(this, \''+university.name+'\')">Save</button></div></div>';
		}
	}else{
		saved = '<div class="actions"><div><button class="button is-hidden deleteUni" data-type="delete" onclick="deleteUniversity(this, \''+university.name+'\')">Delete</button></div>' +
			'<div><button class="button saveUni" data-type="save" onclick="saveUniversity(this, \''+university.name+'\')">Save</button></div></div>';
	}

	return `
		<div id="${university.name.replace(/\s/g, '').toLowerCase()}" class="column box is-one-quarter p-2 my-4">
			<div>${university.country}</div>
			<div class="is-size-5 has-text-primary has-text-weight-bold">${university.name}</div>
			<div>${domains}</div>
			${saved}
		</div>
	`
}

function saveUniversity(ele, university){

	//modify to save more than 1 university to localstorate.
	let  savedUniversities = JSON.parse(localStorage.getItem('university'))

	if(savedUniversities !== null){
		//add uni to already existing local storage
		savedUniversities.push(university)
		localStorage.setItem("university", JSON.stringify(savedUniversities))
	}else{
		//add first uni as stringify array to local storage
		localStorage.setItem("university", JSON.stringify([university]));
	}
	checkSaved(ele);
}

function deleteUniversity(ele, university){
	let  savedUniversities = JSON.parse(localStorage.getItem('university'))
	if(savedUniversities !== null){
		const index = savedUniversities.indexOf(university)
		if (index > -1) {
			savedUniversities.splice(index, 1)
		}
		localStorage.setItem("university", JSON.stringify(savedUniversities))
	}
	checkSaved(ele);
}

document.getElementById("header").innerHTML = "<div class='container p-4'><span class='has-text-weight-bold'>NSN</span></div>"

document.getElementById("footer").innerHTML = `
<div class="has-background-grey-dark">
<div class='container p-4 has-text-white-ter'>
<div class="columns is-desktop">
<div class="column has-text-centered-mobile">NSN</div>
<div class="column  has-text-right">
<a class="has-text-white mr-3 is-block-mobile has-text-centered-mobile my-2" href=/><i class="fa-solid fa-house"></i> Home</a>
<a class="has-text-white mr-3 is-block-mobile has-text-centered-mobile my-2" href=/><i class="fa-solid fa-lock"></i> Privacy</a>
<a class="has-text-white mr-3 is-block-mobile has-text-centered-mobile my-2" href=/><i class="fa-solid fa-gavel"></i> Terms</a>
<a class="has-text-white is-block-mobile has-text-centered-mobile my-2" href=/><i class="fa-solid fa-phone-volume"></i> Contact</a>
</div>
</div>
</div>
</div>`