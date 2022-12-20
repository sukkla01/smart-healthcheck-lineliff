export async function initLiff  ()  {
    const liff = (await import('@line/liff')).default
    await liff.ready
    const profile = await liff.getProfile()

    return profile;
}