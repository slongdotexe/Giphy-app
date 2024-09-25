export interface GiphyImageDataEntry {
  url: string
  width: string
  height: string
}

// Not complete, just get to get a little bit of typing for the fields we care most about.
export interface GiphyApiData {
  id: string
  images: {
    downsized: GiphyImageDataEntry
    downsize_still: GiphyImageDataEntry
    fixed_width: GiphyImageDataEntry
    fixed_width_still: GiphyImageDataEntry
  }
}
