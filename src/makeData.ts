export type Person = {
    personId: any,
    firstName: string
    lastName: string
    age: number
    visits: number
    progress: number
    status: 'relationship' | 'complicated' | 'single'
    subRows?: Person[]
}


const subRows: Person[] =   [
    {
        personId: 1,
        firstName: "Alex",
        lastName: "Brown",
        age: 22,
        visits: 3,
        progress: 50,
        status: "single"
    },
    {
        personId: 2,
        firstName: "Emily",
        lastName: "Davis",
        age: 30,
        visits: 12,
        progress: 85,
        status: "relationship"
    }
];


const people: Person[] = [
    {
        personId: 1,
        firstName: "John",
        lastName: "Doe",
        age: 25,
        visits: 10,
        progress: 80,
        status: "single",
        subRows
    },
    {
        personId: 2,
        firstName: "Jane",
        lastName: "Smith",
        age: 32,
        visits: 15,
        progress: 60,
        status: "relationship",
        subRows
    },
    {
        personId: 3,
        firstName: "Michael",
        lastName: "Johnson",
        age: 40,
        visits: 5,
        progress: 90,
        status: "complicated",
        subRows
    },
    {
        personId: 4,
        firstName: "Sarah",
        lastName: "Williams",
        age: 28,
        visits: 8,
        progress: 70,
        status: "single",
        subRows
    }
];


export function makeData() {
    /*const makeDataLevel = (depth = 0): Person[] => {
        const len = lens[depth]!
        return range(len).map((d): Person => {
            return {
                ...newPerson(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            }
        })
    }*/

    return people;
}
