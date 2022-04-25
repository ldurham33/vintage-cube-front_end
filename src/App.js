import logo from './logo.svg';
import './App.css';
import functions from './functions'
import { useState, useEffect } from 'react'
import axios from 'axios'
function App() {
    const [allUsers, setAllUsers] = useState([])
    const [card, setCard] = useState('')
    const [card2, setCard2] = useState('')
    const [cards, setCards] = useState([])
    const [stage, setStage] = useState(-1)
    const [username, setUsername] = useState('')
    const [user, setUser] = useState([])
    const [sortIndex, setSortIndex] = useState(1)
    const [indx1, setIndx1] = useState(1)
    const [indx2, setIndx2] = useState(1)
    const [ID, setID] = useState(0)
    const [sortArray, setSortArray] = useState([])
    const hook = () => {
        functions.getAll().then(response => {
            setStage(0)
            setAllUsers(response.data)
            console.log('promise fulfilled')
            console.log(response.data)
            setCards(response.data[0].cards)
            console.log(response.data[0].indx)
            setID(response.data[0].id)
            console.log(response.data[0].id)
            /*const newCards = response.data.columna.map(card => card.card_digest)
            setCards(newCards)*/
        })}
    useEffect(hook, [])
    /*const randomize = () => {
        console.log('button clicked')
        const num = 1 + Math.round(Math.random() * (cards.length - 1))
        const num2 = 1 + Math.round(Math.random() * (cards.length - 1))
        setPhoto(cards[num].image_uris.front)
        setPhoto2(cards[num2].image_uris.front)
    }*/
    const createCSV = (data) => {
        const header = ["Ranking", "Card Name", "Rating\n"]
        let csv = [[header]]
        for (let i = 1; i <= data.length; i++) {
            let name = data[i - 1].name
            name = name.replace(/,/g, "")
            const row = [`${i}`, name, `${data[i - 1].rating}`]
            csv += row.join(',') + "\n"
        }
        console.log(csv)
        return csv
    }
    const download = () => {
        let csvData = new Blob([createCSV(sortArray[0])], { type: 'text/csv' });
        let csvUrl = URL.createObjectURL(csvData);
        let hiddenElement = document.createElement('a');
        hiddenElement.href = csvUrl;
        hiddenElement.target = '_blank';
        hiddenElement.download = username + '_cube_ranking.csv';
        hiddenElement.click();
    }
    const downloadGlobal = () => {
        functions.get(ID).then(response => {
            const globalData = response.data
            const globalSort = globalData.sortArray
            let csvData = new Blob([createCSV(globalSort[0])], { type: 'text/csv' });
            let csvUrl = URL.createObjectURL(csvData);
            let hiddenElement = document.createElement('a');
            hiddenElement.href = csvUrl;
            hiddenElement.target = '_blank';
            hiddenElement.download ='global_cube_ranking.csv';
            hiddenElement.click();
        })

    }
    const displayCSV = (data) => {

        const csv = createCSV(data)
        let table = ``
        for (let i = 0; i < csv.length; i++) {
            const row = csv[i]
            table += <tr>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                    </tr>
        }
        return table
    }
    const skip = () => {
        const num = Math.random()
        if (num > .5) {
            const dupSort = [...sortArray]
            if (indx2 === 0) {
                if (indx1 === 0) {
                    let secondArray = dupSort[sortIndex - 1]
                    let firstArray = dupSort[sortIndex]
                    console.log(JSON.stringify(firstArray))
                    console.log(JSON.stringify(secondArray))
                    console.log(sortArray)
                    console.log(sortIndex)
                    secondArray.splice(indx2, 0, card)
                    console.log(JSON.stringify(secondArray))
                    let copySort = [...sortArray]
                    copySort.splice(sortIndex - 1, 1, secondArray)
                    console.log(JSON.stringify(copySort))
                    copySort.splice(sortIndex, 1)
                    if (sortIndex + 2 > copySort.length) {
                        if (dupSort.length === 1) {
                            setSortArray(copySort)
                            setStage(2)
                            const update = {
                                name: username,
                                cards: copySort[0],
                                sortArray: copySort,
                                indx1: 0,
                                indx2: 0,
                                sort_index: 1
                            }
                            setUser(update)
                            if (allUsers.findIndex(user => user.name == username) < 0) {
                                functions.getAll().then(response => {
                                    setAllUsers(response.data)
                                    const id = response.data[response.data.findIndex(user => user.name == username)].id
                                    functions.update(update, id)
                                })
                            }
                            const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                            functions.update(update, id)
                            return
                        } else {
                            setSortArray(copySort)
                            setSortIndex(1)
                            firstArray = copySort[1]
                            secondArray = copySort[0]
                            setIndx1(firstArray.length - 1)
                            setIndx2(secondArray.length - 1)
                            setCard(firstArray[firstArray.length - 1])
                            setCard2(secondArray[secondArray.length - 1])
                            const update = {
                                name: username,
                                cards: cards,
                                sortArray: copySort,
                                indx1: firstArray.length - 1,
                                indx2: secondArray.length - 1,
                                sort_index: 1
                            }
                            setUser(update)
                            if (allUsers.findIndex(user => user.name == username) < 0) {
                                functions.getAll().then(response => {
                                    setAllUsers(response.data)
                                    const id = response.data[response.data.findIndex(user => user.name == username)].id
                                    functions.update(update, id)
                                })
                            }
                            const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                            functions.update(update, id)
                            return
                        }
                    } else {
                        setSortArray(copySort)
                        const save = sortIndex
                        setSortIndex(sortIndex + 1)
                        firstArray = copySort[save + 1]
                        secondArray = copySort[save]
                        setIndx1(firstArray.length - 1)
                        setIndx2(secondArray.length - 1)
                        setCard(firstArray[firstArray.length - 1])
                        setCard2(secondArray[secondArray.length - 1])
                        const update = {
                            name: username,
                            cards: cards,
                            sortArray: copySort,
                            indx1: firstArray.length - 1,
                            indx2: secondArray.length - 1,
                            sort_index: save + 1
                        }
                        setUser(update)
                        if (allUsers.findIndex(user => user.name == username) < 0) {
                            functions.getAll().then(response => {
                                setAllUsers(response.data)
                                const id = response.data[response.data.findIndex(user => user.name == username)].id
                                functions.update(update, id)
                            })
                            return
                        } else {
                            const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                            functions.update(update, id)
                            return
                        }
                    }
                } else {
                    let secondArray = dupSort[sortIndex - 1]
                    let firstArray = dupSort[sortIndex]
                    console.log(JSON.stringify(firstArray))
                    console.log(JSON.stringify(secondArray))
                    console.log(sortArray)
                    console.log(sortIndex)
                    console.log(JSON.stringify(secondArray))
                    let copySort = [...sortArray]
                    console.log(JSON.stringify(copySort))
                    for (let i = indx1; i > -1; i--) {
                        secondArray.splice(0, 0, firstArray[i])
                    }
                    copySort.splice(sortIndex - 1, 1, secondArray)
                    //copySort.splice(sortIndex, 1)
                    copySort.splice(sortIndex, 1)
                    if (sortIndex + 2 > copySort.length) {
                        if (copySort.length === 1) {
                            setStage(2)
                            setSortArray(copySort)
                            const update = {
                                name: username,
                                cards: copySort[0],
                                sortArray: copySort,
                                indx1: 0,
                                indx2: 0,
                                sort_index: 0
                            }
                            setUser(update)
                            if (allUsers.findIndex(user => user.name == username) < 0) {
                                functions.getAll().then(response => {
                                    setAllUsers(response.data)
                                    const id = response.data[response.data.findIndex(user => user.name == username)].id
                                    functions.update(update, id)
                                })
                            }
                            const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                            functions.update(update, id)
                            return
                        } else {
                            setSortArray(copySort)
                            setSortIndex(1)
                            firstArray = copySort[1]
                            secondArray = copySort[0]
                            setIndx1(firstArray.length - 1)
                            setIndx2(secondArray.length - 1)
                            setCard(firstArray[firstArray.length - 1])
                            setCard2(secondArray[secondArray.length - 1])
                            const update = {
                                name: username,
                                cards: cards,
                                sortArray: copySort,
                                indx1: firstArray.length - 1,
                                indx2: secondArray.length - 1,
                                sort_index: 1
                            }
                            setUser(update)
                            if (allUsers.findIndex(user => user.name == username) < 0) {
                                functions.getAll().then(response => {
                                    setAllUsers(response.data)
                                    const id = response.data[response.data.findIndex(user => user.name == username)].id
                                    functions.update(update, id)
                                })
                            }
                            const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                            functions.update(update, id)
                            return
                        }
                    } else {
                        setSortArray(copySort)
                        const save = sortIndex
                        setSortIndex(sortIndex + 1)
                        firstArray = copySort[save + 1]
                        secondArray = copySort[save]
                        setIndx1(firstArray.length - 1)
                        setIndx2(secondArray.length - 1)
                        setCard(firstArray[firstArray.length - 1])
                        setCard2(secondArray[secondArray.length - 1])
                        const update = {
                            name: username,
                            cards: cards,
                            sortArray: copySort,
                            indx1: firstArray.length - 1,
                            indx2: secondArray.length - 1,
                            sort_index: save + 1
                        }
                        setUser(update)
                        if (allUsers.findIndex(user => user.name == username) < 0) {
                            functions.getAll().then(response => {
                                setAllUsers(response.data)
                                const id = response.data[response.data.findIndex(user => user.name == username)].id
                                functions.update(update, id)
                            })
                        }
                        const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                        functions.update(update, id)
                        return
                    }
                }
            } //else if (firstArray.findIndex(element => element.name == secondArray[indx2 - 1]) > -1 && firstArray.findIndex(element => element.name == secondArray[indx2 - 1]) < indx) {
            else {
                const save = indx2
                //setSortArray(copySort)
                let secondArray = sortArray[sortIndex - 1]
                setCard2(secondArray[indx2 - 1])
                setIndx2(indx2 - 1)
                const update = {
                    name: username,
                    cards: cards,
                    sortArray: sortArray,
                    indx1: indx1,
                    indx2: save - 1,
                    sort_index: sortIndex
                }
                setUser(update)
                if (allUsers.findIndex(user => user.name == username) < 0) {
                    functions.getAll().then(response => {
                        setAllUsers(response.data)
                        const id = response.data[response.data.findIndex(user => user.name == username)].id
                        functions.update(update, id)
                    })
                }
                const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                functions.update(update, id)
            }
        } else {
            let dupSort = [...sortArray]
        let firstArray = dupSort[sortIndex]
        let secondArray = dupSort[sortIndex - 1]
        console.log(firstArray)
        console.log(sortArray)
        console.log(indx2)
        secondArray.splice(indx2 + 1, 0, card)
        let copySort = [...sortArray]
        console.log(secondArray)
        copySort.splice(sortIndex - 1, 1, secondArray)
        console.log(copySort)
        setSortArray(copySort)
            if (indx1 === 0) {
                copySort.splice(sortIndex, 1)
                if (sortIndex + 2 > copySort.length) {
                    if (copySort.length === 1) {
                        setSortArray(copySort)
                        setStage(2)
                        const update = {
                            name: username,
                            cards: copySort[0],
                            sortArray: copySort,
                            indx1: 0,
                            indx2: 0,
                            sort_index: 1
                        }
                        setUser(update)
                        if (allUsers.findIndex(user => user.name == username) < 0) {
                            functions.getAll().then(response => {
                                setAllUsers(response.data)
                                const id = response.data[response.data.findIndex(user => user.name == username)].id
                                functions.update(update, id)
                            })
                        }
                        const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                        functions.update(update, id)
                        return
                    } else {
                        setSortArray(copySort)
                        setSortIndex(1)
                        firstArray = copySort[1]
                        secondArray = copySort[0]
                        setIndx1(firstArray.length - 1)
                        setIndx2(secondArray.length - 1)
                        setCard(firstArray[firstArray.length - 1])
                        setCard2(secondArray[secondArray.length - 1])
                        const update = {
                            name: username,
                            cards: cards,
                            sortArray: copySort,
                            indx1: firstArray.length - 1,
                            indx2: secondArray.length - 1,
                            sort_index: 1
                        }
                        setUser(update)
                        if (allUsers.findIndex(user => user.name == username) < 0) {
                            functions.getAll().then(response => {
                                setAllUsers(response.data)
                                const id = response.data[response.data.findIndex(user => user.name == username)].id
                                functions.update(update, id)
                            })
                        }
                        const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                        functions.update(update, id)
                        return
                    }
                } else {

                    const save = sortIndex
                    setSortIndex(sortIndex + 1)
                    firstArray = copySort[save + 1]
                    secondArray = copySort[save]
                    setIndx1(indx1 - 1)
                    const update = {
                        name: username,
                        cards: cards,
                        sortArray: copySort,
                        indx1: firstArray.length - 1,
                        indx2: secondArray.length - 1,
                        sort_index: save + 1
                    }
                    setIndx1(firstArray.length - 1)
                    setIndx2(secondArray.length - 1)
                    setCard(firstArray[firstArray.length - 1])
                    setCard2(secondArray[secondArray.length - 1])
                    //setIndx(sortIndex + 1)
                    //setSortIndex(sortIndex + 1)
                    setUser(update)
                    if (allUsers.findIndex(user => user.name == username) < 0) {
                        functions.getAll().then(response => {
                            setAllUsers(response.data)
                            const id = response.data[response.data.findIndex(user => user.name == username)].id
                            functions.update(update, id)
                        })
                    } else {
                        const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                        functions.update(update, id)
                    }
                    return
                }
            } else {
                firstArray = copySort[sortIndex]
                firstArray.splice(indx1, 1)
                const save = indx1
                setIndx1(indx1 - 1)
                const update = {
                    name: username,
                    cards: cards,
                    sortArray: copySort,
                    indx1: save - 1,
                    indx2: indx2,
                    sort_index: sortIndex
                }
                setCard(firstArray[save - 1])
                //setIndx(sortIndex + 1)
                //setSortIndex(sortIndex + 1)
                setUser(update)
                if (allUsers.findIndex(user => user.name == username) < 0) {
                    functions.getAll().then(response => {
                        setAllUsers(response.data)
                        const id = response.data[response.data.findIndex(user => user.name == username)].id
                        functions.update(update, id)
                    })
                } else {
                    const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                    functions.update(update, id)
                }
                return
            }
        }
    }
    const left = () => {
        //This means that the current card wins, so keep going up the list
        console.log('left card wins')
        console.log(JSON.stringify(sortArray))
        functions.get(ID).then(response => {
            const k = 16
            const globalCards = response.data.cards
            const newindx = globalCards.findIndex(element => element.name == card.name)
            const newindx2 = globalCards.findIndex(element => element.name == card2.name)
            const prob = 1 / (1 + Math.pow(10, (globalCards[newindx2].rating - globalCards[newindx].rating) / 400))
            const diff = k * (1 - prob)
            const newRating = globalCards[newindx].rating + diff
            const newRating2 = globalCards[newindx2].rating - diff
            const newCard = globalCards[newindx]
            newCard.rating = newRating
            const newCard2 = globalCards[newindx2]
            newCard2.rating = newRating2
            globalCards.sort(function (a, b) { return b.rating - a.rating })
            const globalUpdate = {
                name: 'global',
                cards: globalCards,
                indx1: 0,
                indx2: 0,
                sortArray: [globalCards],
                sort_index: 1
            }
            functions.update(globalUpdate, response.data.id)
        })
        const k = 16
        const prob = 1 / (1 + Math.pow(10, (card2.rating - card.rating) / 400))
        const diff = k * (1 - prob)
        const newRating = card.rating + diff
        const newRating2 = card2.rating - diff
        const newCard = card
        newCard.rating = newRating
        const newCard2 = card2
        newCard2.rating = newRating2
        const copy = user.cards
        console.log(JSON.stringify(sortArray))
        const dupSort = [...sortArray]
        if (indx2 === 0) {
            if (indx1 === 0) {
                let secondArray = dupSort[sortIndex - 1]
                let firstArray = dupSort[sortIndex]
                console.log(JSON.stringify(firstArray))
                console.log(JSON.stringify(secondArray))
                console.log(sortArray)
                console.log(sortIndex)
                secondArray.splice(indx2, 0, card)
                console.log(JSON.stringify(secondArray))
                let copySort = [...sortArray]
                copySort.splice(sortIndex - 1, 1, secondArray)
                console.log(JSON.stringify(copySort))
                copySort.splice(sortIndex, 1)
                if (sortIndex + 2 > copySort.length) {
                    if (dupSort.length === 1) {
                        setSortArray(copySort)
                        setStage(2)
                        const update = {
                            name: username,
                            cards: copySort[0],
                            sortArray: copySort,
                            indx1: 0,
                            indx2: 0,
                            sort_index: 1
                        }
                        setUser(update)
                        if (allUsers.findIndex(user => user.name == username) < 0) {
                            functions.getAll().then(response => {
                                setAllUsers(response.data)
                                const id = response.data[response.data.findIndex(user => user.name == username)].id
                                functions.update(update, id)
                            })
                        }
                        const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                        functions.update(update, id)
                        return
                    } else {
                        setSortArray(copySort)
                        setSortIndex(1)
                        firstArray = copySort[1]
                        secondArray = copySort[0]
                        setIndx1(firstArray.length - 1)
                        setIndx2(secondArray.length - 1)
                        setCard(firstArray[firstArray.length - 1])
                        setCard2(secondArray[secondArray.length - 1])
                        const update = {
                            name: username,
                            cards: cards,
                            sortArray: copySort,
                            indx1: firstArray.length - 1,
                            indx2: secondArray.length - 1,
                            sort_index: 1
                        }
                        setUser(update)
                        if (allUsers.findIndex(user => user.name == username) < 0) {
                            functions.getAll().then(response => {
                                setAllUsers(response.data)
                                const id = response.data[response.data.findIndex(user => user.name == username)].id
                                functions.update(update, id)
                            })
                        }
                        const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                        functions.update(update, id)
                        return
                    }
                } else {
                    setSortArray(copySort)
                    const save = sortIndex
                    setSortIndex(sortIndex + 1)
                    firstArray = copySort[save + 1]
                    secondArray = copySort[save]
                    setIndx1(firstArray.length - 1)
                    setIndx2(secondArray.length - 1)
                    setCard(firstArray[firstArray.length - 1])
                    setCard2(secondArray[secondArray.length - 1])
                    const update = {
                        name: username,
                        cards: cards,
                        sortArray: copySort,
                        indx1: firstArray.length - 1,
                        indx2: secondArray.length - 1,
                        sort_index: save + 1
                    }
                    setUser(update)
                    if (allUsers.findIndex(user => user.name == username) < 0) {
                        functions.getAll().then(response => {
                            setAllUsers(response.data)
                            const id = response.data[response.data.findIndex(user => user.name == username)].id
                            functions.update(update, id)
                        })
                        return
                    } else {
                        const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                        functions.update(update, id)
                        return
                    }
                }
            } else {
                let secondArray = dupSort[sortIndex - 1]
                let firstArray = dupSort[sortIndex]
                console.log(JSON.stringify(firstArray))
                console.log(JSON.stringify(secondArray))
                console.log(sortArray)
                console.log(sortIndex)
                console.log(JSON.stringify(secondArray))
                let copySort = [...sortArray]
                console.log(JSON.stringify(copySort))
                for (let i = indx1; i > -1; i--) {
                    secondArray.splice(0, 0, firstArray[i])
                }
                copySort.splice(sortIndex - 1, 1, secondArray)
                //copySort.splice(sortIndex, 1)
                copySort.splice(sortIndex, 1)
                if (sortIndex + 2 > copySort.length) {
                    if (copySort.length === 1) {
                        setStage(2)
                        setSortArray(copySort)
                        const update = {
                            name: username,
                            cards: copySort[0],
                            sortArray: copySort,
                            indx1: 0,
                            indx2: 0,
                            sort_index: 0
                        }
                        setUser(update)
                        if (allUsers.findIndex(user => user.name == username) < 0) {
                            functions.getAll().then(response => {
                                setAllUsers(response.data)
                                const id = response.data[response.data.findIndex(user => user.name == username)].id
                                functions.update(update, id)
                            })
                        }
                        const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                        functions.update(update, id)
                        return
                    } else {
                        setSortArray(copySort)
                        setSortIndex(1)
                        firstArray = copySort[1]
                        secondArray = copySort[0]
                        setIndx1(firstArray.length - 1)
                        setIndx2(secondArray.length - 1)
                        setCard(firstArray[firstArray.length - 1])
                        setCard2(secondArray[secondArray.length - 1])
                        const update = {
                            name: username,
                            cards: cards,
                            sortArray: copySort,
                            indx1: firstArray.length - 1,
                            indx2: secondArray.length - 1,
                            sort_index: 1
                        }
                        setUser(update)
                        if (allUsers.findIndex(user => user.name == username) < 0) {
                            functions.getAll().then(response => {
                                setAllUsers(response.data)
                                const id = response.data[response.data.findIndex(user => user.name == username)].id
                                functions.update(update, id)
                            })
                        }
                        const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                        functions.update(update, id)
                        return
                    }
                } else {
                    setSortArray(copySort)
                    const save = sortIndex
                    setSortIndex(sortIndex + 1)
                    firstArray = copySort[save + 1]
                    secondArray = copySort[save]
                    setIndx1(firstArray.length - 1)
                    setIndx2(secondArray.length - 1)
                    setCard(firstArray[firstArray.length - 1])
                    setCard2(secondArray[secondArray.length - 1])
                    const update = {
                        name: username,
                        cards: cards,
                        sortArray: copySort,
                        indx1: firstArray.length - 1,
                        indx2: secondArray.length - 1,
                        sort_index: save+1
                    }
                    setUser(update)
                    if (allUsers.findIndex(user => user.name == username) < 0) {
                        functions.getAll().then(response => {
                            setAllUsers(response.data)
                            const id = response.data[response.data.findIndex(user => user.name == username)].id
                            functions.update(update, id)
                        })
                    }
                    const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                    functions.update(update, id)
                    return
                }
            }
        } //else if (firstArray.findIndex(element => element.name == secondArray[indx2 - 1]) > -1 && firstArray.findIndex(element => element.name == secondArray[indx2 - 1]) < indx) {
        else {
            const save = indx2
            //setSortArray(copySort)
            let secondArray = sortArray[sortIndex - 1]
            setCard2(secondArray[indx2-1])
            setIndx2(indx2 - 1)
            const update = {
                name: username,
                cards: cards,
                sortArray: sortArray,
                indx1: indx1,
                indx2: save-1,
                sort_index: sortIndex
            }
            setUser(update)
            if (allUsers.findIndex(user => user.name == username) < 0) {
                functions.getAll().then(response => {
                    setAllUsers(response.data)
                    const id = response.data[response.data.findIndex(user => user.name == username)].id
                    functions.update(update, id)
                })
            }
            const id = allUsers[allUsers.findIndex(user => user.name == username)].id
            functions.update(update, id)
        }
    }
        /*if (condition) {
        /*copy[indx-1] = newCard
        copy[indx] = newCard2
        if (indx > 1) {
            const update = {
                name: username,
                cards: copy,
                indx: indx - 1,
                sort_index: sortIndex
            }
            setCard(copy[indx - 1])
            setCard2(copy[indx - 2])
            setCards(copy)
            //setIndx(indx - 1)
            if (allUsers.findIndex(user => user.name == username) < 0) {
                functions.getAll().then(response => {
                    setAllUsers(response.data)
                    const id = response.data[response.data.findIndex(user => user.name == username)].id
                    functions.update(update, id)
                })
            } else {
                const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                functions.update(update, id)
            }
        } else {
            const update = {
                name: username,
                cards: copy,
                indx: sortIndex + 1,
                sort_index: sortIndex + 1
            }*/
        
            /*setCard(copy[sortIndex + 1])
            setCard2(copy[sortIndex])
            setCards(copy)
            setIndx(sortIndex + 1)
            setSortIndex(sortIndex + 1)*/
        
        //update.cards.sort(function (a, b) { return a.rating - b.rating })
        /*let difference = []
        for (let i = 0; i < update.cards.length - 1; i++) {
            difference = difference.concat(update.cards[i+1].rating-update.cards[i].rating)
        }
        console.log(difference)
        const next = difference.findIndex(element => element === 0)*/
    const right = () => {
        //this means the current card lost, so move on to the next one
        console.log('right card wins')
        console.log(sortArray)
        functions.get(ID).then(response => {
            const k = 16
            const globalCards = response.data.cards
            const newindx = globalCards.findIndex(element => element.name == card.name)
            const newindx2 = globalCards.findIndex(element => element.name == card2.name)
            const prob = 1 / (1 + Math.pow(10, (globalCards[newindx].rating - globalCards[newindx2].rating) / 400))
            console.log('prob:', prob)
            const diff = k * (1 - prob)
            const newRating = globalCards[newindx].rating - diff
            const newRating2 = globalCards[newindx2].rating + diff
            const newCard = globalCards[newindx]
            newCard.rating = newRating
            const newCard2 = globalCards[newindx2]
            newCard2.rating = newRating2
            globalCards.sort(function (a, b) { return b.rating - a.rating })
            const globalUpdate = {
                name: 'global',
                cards: globalCards,
                indx: 1,
                sort_index: 1
            }
            functions.update(globalUpdate, response.data.id)
        })
        const k = 16
        const prob = 1 / (1 + Math.pow(10, (card.rating - card2.rating) / 400))
        const diff = k * (1 - prob)
        const newRating = card.rating - diff
        const newRating2 = card2.rating + diff
        const newCard = card
        newCard.rating = newRating
        const newCard2 = card2
        newCard2.rating = newRating2
        let dupSort = [...sortArray]
        let firstArray = dupSort[sortIndex]
        let secondArray = dupSort[sortIndex - 1]
        console.log(firstArray)
        console.log(sortArray)
        console.log(indx2)
        secondArray.splice(indx2 + 1, 0, card)
        let copySort = [...sortArray]
        console.log(secondArray)
        copySort.splice(sortIndex - 1, 1, secondArray)
        console.log(copySort)
        setSortArray(copySort)
        if (indx1 === 0) {
            copySort.splice(sortIndex, 1)
            if (sortIndex + 2 > copySort.length) {
                if (copySort.length === 1) {
                    setSortArray(copySort)
                    setStage(2)
                    const update = {
                        name: username,
                        cards: copySort[0],
                        sortArray: copySort,
                        indx1: 0,
                        indx2: 0,
                        sort_index: 1
                    }
                    setUser(update)
                    if (allUsers.findIndex(user => user.name == username) < 0) {
                        functions.getAll().then(response => {
                            setAllUsers(response.data)
                            const id = response.data[response.data.findIndex(user => user.name == username)].id
                            functions.update(update, id)
                        })
                    }
                    const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                    functions.update(update, id)
                    return
                } else {
                    setSortArray(copySort)
                    setSortIndex(1)
                    firstArray = copySort[1]
                    secondArray = copySort[0]
                    setIndx1(firstArray.length - 1)
                    setIndx2(secondArray.length - 1)
                    setCard(firstArray[firstArray.length - 1])
                    setCard2(secondArray[secondArray.length - 1])
                    const update = {
                        name: username,
                        cards: cards,
                        sortArray: copySort,
                        indx1: firstArray.length - 1,
                        indx2: secondArray.length - 1,
                        sort_index: 1
                    }
                    setUser(update)
                    if (allUsers.findIndex(user => user.name == username) < 0) {
                        functions.getAll().then(response => {
                            setAllUsers(response.data)
                            const id = response.data[response.data.findIndex(user => user.name == username)].id
                            functions.update(update, id)
                        })
                    }
                    const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                    functions.update(update, id)
                    return
                }
            } else {
                
                const save = sortIndex
                setSortIndex(sortIndex + 1)
                firstArray = copySort[save + 1]
                secondArray = copySort[save]
                setIndx1(indx1 - 1)
                const update = {
                    name: username,
                    cards: cards,
                    sortArray: copySort,
                    indx1: firstArray.length - 1,
                    indx2: secondArray.length - 1,
                    sort_index: save + 1
                }
                setIndx1(firstArray.length - 1)
                setIndx2(secondArray.length - 1)
                setCard(firstArray[firstArray.length - 1])
                setCard2(secondArray[secondArray.length - 1])
                //setIndx(sortIndex + 1)
                //setSortIndex(sortIndex + 1)
                setUser(update)
                if (allUsers.findIndex(user => user.name == username) < 0) {
                    functions.getAll().then(response => {
                        setAllUsers(response.data)
                        const id = response.data[response.data.findIndex(user => user.name == username)].id
                        functions.update(update, id)
                    })
                } else {
                    const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                    functions.update(update, id)
                }
                return
            }
        } else {
            firstArray = copySort[sortIndex]
            firstArray.splice(indx1,1)
            const save = indx1
            setIndx1(indx1 - 1)
            const update = {
                name: username,
                cards: cards,
                sortArray: copySort,
                indx1: save - 1,
                indx2: indx2,
                sort_index: sortIndex
            }
            setCard(firstArray[save - 1])
            //setIndx(sortIndex + 1)
            //setSortIndex(sortIndex + 1)
            setUser(update)
            if (allUsers.findIndex(user => user.name == username) < 0) {
                functions.getAll().then(response => {
                    setAllUsers(response.data)
                    const id = response.data[response.data.findIndex(user => user.name == username)].id
                    functions.update(update, id)
                })
            } else {
                const id = allUsers[allUsers.findIndex(user => user.name == username)].id
                functions.update(update, id)
            }
            return
        }
        
        /*const update = {
            name: username,
            cards: copy,
            id: ID
        }
        update.cards.sort(function (a, b) { return a.rating - b.rating })
        let difference = []
        for (let i = 0; i < update.cards.length - 1; i++) {
            difference = difference.concat(update.cards[i + 1].rating - update.cards[i].rating)
        }
        console.log(difference)
        const next = difference.findIndex(element => element === 0)
        setCard(update.cards[next])
        setCard2(update.cards[next + 1])
        setUser(update)
        console.log(ID)
        functions.update(update, ID)*/
    }
    const submit = () => {
        if (username == 'global') {
            window.alert('global is not permitted as a username')
            setUsername('')
            return
        }else if (allUsers.findIndex(user => user.name == username) > -1) {
        //if (false) {
            if (window.confirm(`${username} is already an existing username. Is this your username that you would like to continue on?`)) {
                const current_user = allUsers[allUsers.findIndex(user => user.name == username)]
                /*const globalUpdate = {
                    name: 'global',
                    cards: current_user.cards,
                    indx: current_user.indx,
                    sort_index: current_user.sort_index
                }
                functions.update(globalUpdate,ID)*/
                console.log(current_user)
                setUser(current_user)
                const tempCards = current_user.cards
                setCards(tempCards)
                /*let difference = []
                for (let i = 0; i < tempCards.length - 1; i++) {
                    difference = difference.concat(tempCards[i + 1].rating - tempCards[i].rating)
                }
                console.log(difference)
                const next = difference.findIndex(element => element === 0)*/
                console.log(tempCards)
                //console.log(current_user.indx)
                //setCard(tempCards[current_user.indx])
                //setCard2(tempCards[current_user.indx - 1])
                setSortIndex(current_user.sort_index)
                console.log(current_user.sort_index)
                setSortArray(current_user.sortArray)
                const array = current_user.sortArray
                if (array.length == 1) {
                    setStage(2)
                } else {
                    const firstArray = current_user.sortArray[current_user.sort_index]
                    const secondArray = current_user.sortArray[current_user.sort_index - 1]
                    setCard(firstArray[current_user.indx1])
                    setCard2(secondArray[current_user.indx2])
                    setStage(1)
                }
                return
                setIndx1(current_user.indx1)
                setIndx2(current_user.indx2)
            } else {
                setUsername('')
            }
        } else {
            if (window.confirm(`${username} does not exist. Would you like to start a new ranking with this username?`)) {
                //setStage(1)
                const cardArray = cards.map(card => card = {
                    name: card.name,
                    rating: 1000,
                    //images: card.image_uris,
                    images:card.images,
                    id: card.id
                })
                console.log(cardArray)
                const num = 1
                const num2 = 0
                setCards(cardArray)
                setCard(cardArray[num])
                setCard2(cardArray[num2])
                console.log('new user')
                let tempSort = []
                cardArray.forEach(card => {
                    const newElement = [card]
                    tempSort=tempSort.concat([newElement])
                })
                setSortArray(tempSort)
                console.log('tempSort:', JSON.stringify(tempSort))
                const newUser = {
                    name: username,
                    cards: cardArray,
                    sortArray: tempSort,
                    indx1: 0,
                    indx2: 0,
                    sort_index: 1
                }
                setIndx1(0)
                setIndx2(0)
                setSortIndex(1)
                setUser(newUser)
                console.log(newUser)
                functions.create(newUser)
                setStage(1)
                /*const newUser = {
                    name: username,
                    cards: cardArray,
                    id: 0
                }
                setUser(newUser)
                console.log(newUser)
                functions.create(newUser)
                setStage(1)*/
            }
            else {
                console.log('reset')
                setUsername('')
                return
            }
        }
    }
    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }
    if (stage === -1) {
        return(<div><p>Loading</p></div>)
    } else if (stage === 0) {
        return (
            <div className="App">
                <form onSubmit={submit}>
                    <input
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <button type="submit">submit</button>
                </form>
            </div>
        )
    } else if (stage === 1) {
        console.log(card)
        console.log(card2)
        if (!('back' in card.images)) {
            if (!('back' in card2.images)) {
                return (
                    <div className="App">
                        <p>{username}</p>
                        <p> <button onClick={() => left()} style={{ height: 50, width: 500 }}>{card.name}</button>                   <button onClick={() => right()} style={{ height: 50, width: 500 }}>{card2.name}</button></p>
                        <p><button onClick={() => skip()} style={{ height: 50, width: 500 }}>skip</button></p>
                        <img src={card.images.front}
                            width="250"
                            height="350" /> <img src={card2.images.front}
                                width="250"
                                height="350" />
                    </div>
                )
            } else {
                return (
                    <div className="App">
                        <p>{username}</p>
                        <p> <button onClick={() => left()} style={{ height: 50, width: 500 }}>{card.name}</button>                   <button onClick={() => right()} style={{ height: 50, width: 500 }}>{card2.name}</button></p>
                        <p><button onClick={() => skip()} style={{ height: 50, width: 500 }}>skip</button></p>
                        <img src={card.images.front}
                            width="250"
                            height="350" /> <img src={card2.images.front}
                                width="250"
                                height="350" /> <img src={card2.images.back}
                                    width="250"
                                    height="350" />
                    </div>
                )
            }
        } else {
            if (!('back' in card2.images)) {
                return (
                    <div className="App">
                        <p>{username}</p>
                        <p> <button onClick={() => left()} style={{ height: 50, width: 500 }}>{card.name}</button>                   <button onClick={() => right()} style={{ height: 50, width: 500 }}>{card2.name}</button></p>
                        <p><button onClick={() => skip()} style={{ height: 50, width: 500 }}>skip</button></p>
                        <img src={card.images.front}
                            width="250"
                            height="350" /> <img src={card.images.back}
                                width="250"
                                height="350" /><img src={card2.images.front}
                                    width="250"
                                    height="350" />
                    </div>
                )
            } else {
                return (
                    <div className="App">
                        <p>{username}</p>
                        <p> <button onClick={() => left()} style={{ height: 50, width: 500 }}>{card.name}</button>                   <button onClick={() => right()} style={{ height: 50, width: 500 }}>{card2.name}</button></p>
                        <p><button onClick={() => skip()} style={{ height: 50, width: 500 }}>skip</button></p>
                        <img src={card.images.front}
                            width="250"
                            height="350" /> <img src={card.images.back}
                                width="250"
                                height="350" /><img src={card2.images.front}
                                    width="250"
                                    height="350" /><img src={card2.images.back}
                                        width="250"
                                        height="350" />
                    </div>
                )
            }
        }
    } else {
        //const csv = createCSV(sortArray[0])
        return (<div>
            <p>You have completed sorted the cube. Below is your rankings. You may download either your ranking or the global rankings by clicking the buttons</p>
            <button onClick={() => download()} style={{ height: 50, width: 500 }}>{'download your rankings'}</button>
            <button onClick={() => downloadGlobal()} style={{ height: 50, width: 500 }}>{'download the global rankings'}</button>
        </div>)
    }
}


export default App;
