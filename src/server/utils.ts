export const snakeToCamel = (str: string) => (
    str.replace(
        /_\w/g,
        (_: string, idx: number, source: string) => (
            source[idx + 1].toUpperCase()
        )
    )
)
