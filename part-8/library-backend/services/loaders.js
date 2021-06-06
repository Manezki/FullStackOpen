const DataLoader = require("dataloader")
const Book = require("../models/book")

const bookLoader = new DataLoader((authorIds) => { // eslint-disable-line
  return Book.find({ author: { $in: authorIds } }).then((books) => { // eslint-disable-line
    // Scans the books-list multiple times, lookup list would provide better performance
    return authorIds.map((authorId) => books.filter((book) => book.author.toString() === authorId))
  })
})

module.exports = bookLoader
