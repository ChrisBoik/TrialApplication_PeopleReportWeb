export class Person {
    Id?: number | undefined;
    First_Name: string;
    Last_Name: string;
    Date_of_Birth: string;

    private _age: number = -1;
    get Age(): number {
        const currentDate = new Date();
        const dob = new Date(this.Date_of_Birth);
        let age = (currentDate.getFullYear() - dob.getFullYear());
        if (dob > new Date(new Date().setFullYear(currentDate.getFullYear() - age))) age--;
        return age;
    }


    constructor({Id,
        First_Name = "",
        Last_Name = "",
        Date_of_Birth = new Date().toString(),
    }: { Id: number | null, First_Name: string, Last_Name: string, Date_of_Birth: string }) {

        this.Id = Id ?? undefined;
        this.First_Name = First_Name;
        this.Last_Name = Last_Name;
        this.Date_of_Birth = Date_of_Birth;
    }
}