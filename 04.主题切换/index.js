const select = document.querySelector('[name=select]');
const local_key = '__theme__';
let currentTheme = sessionStorage.getItem(local_key) || 'light';

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    sessionStorage.setItem(local_key, theme);
}

select.addEventListener('change', (e) => {
    const val = e.target.value;
    setTheme(val)
    currentTheme = val
})

// 系统当前是否匹配的为dark
const match = matchMedia('(prefers-color-scheme: dark)');

if(currentTheme === 'os'){
    followOs()
}else{
    setTheme(currentTheme)
}
// 跟随系统主题
function followOs() {
    if(match.matches){
        document.documentElement.dataset.theme = 'dark';
    }else{
        document.documentElement.dataset.theme = 'light';
    }
    sessionStorage.setItem(local_key, 'os');
}
match.addEventListener('change', () => currentTheme === 'os' && followOs())