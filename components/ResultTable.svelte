<script>
  import {download_block} from '../scripts/chunk_dl';

  export let data;
  let filename = data.filename;
  let filesize = data.size;
  let hash = data.sha1;

  let blocks = data.block
    .map((v, i) => {
      return {info: v, id: i}
    });

  blocks.forEach(e => {
    let url = e.info.url;
    if (/^http\:\/\//i.test(url)) {
      e.info.url = url.replace(/^http/i, 'https');
    }
  });

  download_block(blocks, filename).then((chunks) => {
    let full_blob = new Blob(chunks, {type: 'application/octet-stream'});
    let url = URL.createObjectURL(full_blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  });

</script>

<style>
    td {
        border: solid 1px;
        border-collapse: collapse;
    }
</style>

<table align="left" style="width: 100%; border: double 3px;">
    <th id="table-header" colspan="3">Result</th>
    <tbody id="results-body" board="1">
    <tr>
        <td id="filename" align="left" colspan="3">
            <p>Filename: {filename}</p>
        </td>
    </tr>
    <tr>
        <td id="filesize" align="left" colspan="3">
            <p>Filesize: {filesize} / Hash: {hash}</p>
        </td>
    </tr>

    {#each blocks as block (block.id)}
        <tr>
            <td>{block.id}</td>
            <td>
                <details>
                    URL: {block.info.url} <br/>
                    Hash: {block.info.sha1}
                </details>
            </td>
            <td>{block.info.size}</td>
        </tr>
    {/each}
    </tbody>
</table>