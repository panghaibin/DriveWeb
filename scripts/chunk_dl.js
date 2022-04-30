import {decode} from "fast-png";

export async function download(url) {
    const ext = url.split('.').pop();
    const resp = await fetch(url, { referrer: '' });
    const ab = await resp.arrayBuffer();
    let data;
    if (ext === 'png') {
        let d = decode(ab).data.buffer;
        let end = unpack(d.slice(0, 4));
        data =  d.slice(4, 4 + end);
    } else {
        data = ab.slice(62);
    }
    return data

    function unpack(ab) {
        return new Uint8Array(ab)
          .reverse()
          .reduce((x, y) => (x<<8) + y)
    }

}
