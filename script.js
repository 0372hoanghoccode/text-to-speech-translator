let khungNhap = document.querySelector("textarea"),
    listGiong = document.querySelector("select"),
    nutDoc = document.querySelector("button");

let apiGiongNoi = speechSynthesis,
    dangDoc = true;

layListGiong(); 

// lấy danh sách giọng
function layListGiong() {
    for (let giong of apiGiongNoi.getVoices()) {
        let daChon = giong.name === "Google US English" ? "selected" : "";
        listGiong.insertAdjacentHTML("beforeend", `<option value="${giong.name}" ${daChon}>${giong.name} (${giong.lang})</option>`);
    }
}
apiGiongNoi.addEventListener("voiceschanged", layListGiong);

//chuyển văn bản thành giọng nói
function vanBanThanhGiongNoi(vanBan) {
    let noi = new SpeechSynthesisUtterance(vanBan);
    noi.voice = apiGiongNoi.getVoices().find(giong => giong.name === listGiong.value);
    apiGiongNoi.speak(noi);
}

nutDoc.addEventListener("click", e => {
    e.preventDefault();
    if (khungNhap.value !== "") {
        if (!apiGiongNoi.speaking) {
            vanBanThanhGiongNoi(khungNhap.value);
        }
        if (khungNhap.value.length > 10) {
            setInterval(() => {
                if (!apiGiongNoi.speaking && !dangDoc) {
                    dangDoc = true;
                    nutDoc.innerText = "đọc";
                }
            }, 500);
            if (dangDoc) {
                apiGiongNoi.resume();
                dangDoc = false;
                nutDoc.innerText = "Click để tạm dừng";
            } else {
                apiGiongNoi.pause();
                dangDoc = true;
                nutDoc.innerText = "Click để tiếp tục đọc";
            }
        } else {
            nutDoc.innerText = "đọc";
        }
    }
});

// dịch
async function dich(vanBan) {
    let cau = vanBan.split('.');
    let dich = await Promise.all(cau.map(async cau => {
        let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURI(cau)}`;
        let phanHoi = await fetch(url);
        if (phanHoi.ok) {
            let duLieu = await phanHoi.json();
            return duLieu[0][0][0];
        }
    }));
    return dich.join('.');
}

document.getElementById('translateBtn').addEventListener("click", e => {
    e.preventDefault();
    if (khungNhap.value !== "") {
        dich(khungNhap.value).then(dich => {
            document.getElementById('translatedText').value = dich;
        });
    }
});

// xoá nhập
let nutXoa = document.querySelector("#clearBtn");
nutXoa.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById('inputText').value = ""; 
    document.getElementById('translatedText').value = ""; 
});

// màu mè
document.getElementById('toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    this.classList.toggle('fa-moon');
    this.classList.toggle('fa-sun');
});
