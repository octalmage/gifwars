import GphApiClient from 'giphy-js-sdk-core'

class GiphyClient {
  constructor(searchPhrase) {
    this.client = GphApiClient('tgBiczTqIBN15ff05k5yc81kN25gt3wo');
    this.rating = 'pg-13';
    this.fmt = 'json';
    this.searchPhrase = searchPhrase
  }

  shuffle(gifs) {
    return gifs[Math.floor(Math.random() * gifs.length)];
  }

  retrieve(nsfw) {
    let rating = nsfw ? '' : this.rating;
    return this.client.search('gifs', {q: this.searchPhrase, limit: 12, rating: rating});
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

  lucky(nsfw) {
    let rating = nsfw ? '' : this.rating;
    return this.client.random('gifs', {rating: rating});
  }
}

export default GiphyClient;
