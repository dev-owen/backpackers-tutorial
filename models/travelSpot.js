const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'travelSpots.json'
);

const getSpotsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class TravelSpots {
    constructor(
        id,
        name,
        imageUrl,
        country,
        cityRegion,
        description,
        stars,
        category
    ) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.country = country;
        this.cityRegion = cityRegion;
        this.description = description;
        this.stars = stars;
        this.category = category;
    }

    save() {
        getSpotsFromFile((spots) => {
            if (this.id) {
                const existingSpotsIndex = spots.findIndex(
                    (s) => s.id === this.id
                );
                const updatedSpots = [...spots];
                updatedSpots[existingSpotsIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedSpots), (err) => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                spots.push(this);
                fs.writeFile(p, JSON.stringify(spots), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        getSpotsFromFile((spots) => {
            // const spot = spots.find((s) => s.id === id);
            const updatedSpots = spots.filter((prod) => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedSpots), (err) => {
                if (!err) {
                    // Spot 삭제
                }
            });
        });
    }

    static fetchAll(cb) {
        getSpotsFromFile(cb);
    }

    static findById(id, cb) {
        getSpotsFromFile((spots) => {
            const spot = spots.find((s) => s.id === id);
            cb(spot);
        });
    }
};
