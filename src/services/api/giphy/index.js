import GphApiClient from 'giphy-js-sdk-core'

class GiphyClient {
  constructor(searchPhrase) {
    this.client = GphApiClient('tgBiczTqIBN15ff05k5yc81kN25gt3wo');
    this.rating = 'pg-13';
    this.fmt = 'json';
    this.searchPhrase = searchPhrase
  }

  shuffle() {
    return this.gifs[Math.floor(Math.random() * this.gifs.length)];
  }

  retrieve() {
    return this.client.search('gifs', {q: this.searchPhrase, limit: 12});
  }

  translate() {
    return this.client.translate('gifs', {s: this.searchPhrase});
  }

  convert(gifObject) {
    return {
      gif: gifObject.id,
      og_src: gifObject.images.original.gif_url,
      src: gifObject.images.downsized_medium.gif_url
    };
  }

  lucky() {
    return this.client.random('gifs', {});
  }
}

export default GiphyClient;
