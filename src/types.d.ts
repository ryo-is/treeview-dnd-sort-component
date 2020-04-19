export type TreeItem = {
  [k: string]: string | number | TreeItem[] | undefined | null
  id: number | null
  name: string
  children?: TreeItem[]
}
