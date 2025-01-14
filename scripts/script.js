import ResultTable from '../components/ResultTable.svelte';
import {download} from "./chunk_dl";

function dec_link(s) {
    let patt = /((bdex|bdrive):\/\/)?([a-fA-F0-9]{40})/;
    let r = patt.exec(s);
    return r === null ? null : [r[2], r[3]];
}

export async function download_meta(meta) {
    let r = dec_link(meta);
    if (r === null) return null;

    let [protocol, hash] = r;
    let ext;
    switch (protocol) {
        case 'bdex':
        case '':
        case undefined:
            ext = 'png';
            break;
        case 'bdrive':
            ext = 'x-ms-bmp';
            break;
        default:
            return null;
    }

    const url = `https://i0.hdslb.com/bfs/album/${hash}.${ext}`;
    try {
        const data = await download(url);
        const json_str = Buffer.from(data).toString('utf8');
        return JSON.parse(json_str);
    } catch (_) {
        return null;
    }
    
}

export async function search() {
    let link = document.getElementById('link').value
    console.log(`link: ${link}`)
    if (/^\s*$/.test(link)) return;

    let meta = download_meta(link);
        
    let msg_box = document.getElementById('msg')
    
    let data;
    if (!meta || !(data = await meta)) {
        msg_box.hidden = false;
        let b = document.createElement('b');
        b.innerText = !meta
            ? "Cannot parse meta link. "
            : "Download meta error. ";
        msg_box.innerHTML = '';
        msg_box.appendChild(b);
        return 
    }

    console.log(data);
    msg_box.hidden = true;
    new ResultTable({
        target: document.getElementById('results'),
        props: {
            data: data
        },
    })
}

window.onload = function () {
    document.getElementById('search').onclick = () => search();
    
    let hash = location.hash;
    let link = /link=(((bdex|bdrive)\:\/\/)?[a-fA-F0-9]{40})/.exec(hash);
    if (link) {
        let input = document.getElementById('link');
        input.value = link[1];
    }
}