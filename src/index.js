const Router = require('@tsndr/cloudflare-worker-router')
const router = new Router()
const dayjs = require("dayjs")
const relativeTime = require("dayjs/plugin/relativeTime")
dayjs.extend(relativeTime)

router.cors()

// Source: https://stackoverflow.com/a/4076440
export function calculateAge(birthDate, otherDate) {
    birthDate = new Date(birthDate)
    otherDate = new Date(otherDate)

    let years = otherDate.getFullYear() - birthDate.getFullYear()

    if (
        otherDate.getMonth() < birthDate.getMonth() ||
        (otherDate.getMonth() === birthDate.getMonth() &&
            otherDate.getDate() < birthDate.getDate())
    ) {
        years--
    }

    return years
}

export function getFormattedDate(dateObj) {
    let today = dateObj || new Date()

    let month = today.getMonth() + 1
    let date = today.getDate()
    let year = today.getFullYear()
    return `${month}/${date}/${year}`
}

router.get('/:month/:day/:year', (req, res) => {
    const {month, day, year} = req.params;
    const birthday = `${month}/${day}/${year}`;
    const age = calculateAge(birthday, getFormattedDate());
    const timeTo = dayjs().to(dayjs(birthday).add(age + 1, "year"));
    res.body = {
        age,
        nextBirthday: timeTo
    }
})

addEventListener('fetch', event => {
    event.respondWith(router.handle(event))
})
