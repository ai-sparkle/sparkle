export async function sanitizeData(
    text: string | null,
    file: File | null,
    allowList?: string[],
    denyList?: string[]
) {
    const formData = new FormData()

    text && formData.append('text', text)
    file && formData.append('file', file)

    allowList && formData.append('allowList', JSON.stringify(allowList))
    denyList && formData.append('denyList', JSON.stringify(denyList))

    try {
        const requestHost = process.env.REACT_APP_HOST_SERVER
            ? process.env.REACT_APP_HOST_SERVER
            : 'https://api.sparkle.ai'
        const response = await fetch(requestHost + '/sanitize/', {
            method: 'POST',
            body: formData,
        })

        if (response.ok) {
            const jsonData = await response.json()
            return jsonData
        } else {
            console.error('Server responded with an error:', response)
        }
    } catch (error) {
        console.error('Failed to send data:', error)
    }
}
