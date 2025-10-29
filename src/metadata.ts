/* eslint-disable */
export default async () => {
    const t = {}
    return {
        '@nestjs/swagger': {
            models: [],
            controllers: [
                [
                    import('./user/user.controller'),
                    { UserController: { getGreetings: { type: Object } } },
                ],
                [
                    import('./news/news.controller'),
                    { NewsController: { getNews: { type: Object } } },
                ],
            ],
        },
    }
}
