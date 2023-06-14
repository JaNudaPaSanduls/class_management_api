const router = require('express').Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Payment = require('../models/Payment');

router.post('/create', auth, async (req, res) => {
    try {
        console.log(req)
        const { class_id, fname, lname, tel_number, nic, grade, Class } = req.body;
        const check_id = await Student.findOne({ classId: class_id, class: Class });
        if (check_id) {
            throw new Error('Class Id already exist');
        }
        const check_nic = await Student.findOne({ nic: nic, grade: grade });
        if (check_nic) {
            throw new Error('NIC number already exists');
        }
        const check_number = await Student.findOne({ tel_number: tel_number, grade: grade });
        if (check_number) {
            throw new Error('Mobile number already exists');
        }

        const student = {
            classId: class_id,
            fname: fname,
            lname: lname,
            tel_number: tel_number,
            nic: nic,
            grade: grade,
            class: Class
        };

        const newStudent = new Student(student);
        await newStudent.save();
        res.status(200).send({ status: 'Student created', student: newStudent });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/get', auth, async (req, res) => {
    try {
        const { grade, Class, ClassId, Attendance } = req.body;
        console.log(req.body)
        const list = [grade, Class, ClassId, Attendance];
        function set_find() {
            let find = {};
            let i = 0;
            while (i < list.length) {
                if (i == 0) {
                    if (grade == "" || grade == undefined) { } else {
                        find.grade = grade
                    }
                }
                if (i == 1) {
                    if (Class == "" || Class == undefined) { } else {
                        find.class = Class
                    }
                }
                if (i == 2) {
                    if (ClassId == "" || ClassId == undefined) { } else {
                        find.classId = ClassId
                    }
                }
                if (i == 3) {
                    if (Attendance == "" || Attendance == undefined) { } else {
                        find.attendance = Attendance
                    }
                    return find;
                }
                i++;
            };
        }
        const stu_info = await set_find();
        const student = await Student.find(stu_info);
        if (!student) {
            throw new Error('Student not found');
        }
        res.status(200).send({ status: 'Student Fetched', student: student });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/get/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const student = await Student.findById(id);
        if (!student) {
            throw new Error('Student not found');
        }
        res.status(200).send({ status: 'Student Fetched', student: student });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/get/attendance', auth, async (req, res) => {
    try {
        if (req.user.admin) {
            const { grade, Class, ClassId, type, Date } = req.body;
            const list = [grade, Class, ClassId, type, Date];
            console.log(list)
            function set_find() {
                let find = {};
                let i = 0;
                while (i < list.length) {
                    if (i == 0) {
                        find.grade = grade;
                    }
                    if (i == 1) {
                        find.class = Class;
                    }
                    if (i == 2) {
                        if (ClassId == "" || ClassId == undefined) { } else {
                            find.classId = ClassId;
                        }
                    }
                    if (i == 3) {
                        if ((type == "" || type == undefined) || type == "ALL") {  } else {
                            find.attendance = type;
                        }
                    }
                    if (i == 4) {
                        if (Date == "" || Date == undefined) { return find; } else {
                            find.date = Date;
                            return find;
                        } 
                    }
                    i++;
                };
            }
            const aten_info = await set_find();
            const attendance = await Attendance.find(aten_info);
            if (!attendance) {
                throw new Error('Attendance not found');
            }
            res.status(200).send({ status: 'Attendance Fetched', attendance: attendance });
        } else {
            throw new Error('Only Admin Function.');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/get/payment', auth, async (req, res) => {
    try {
        if (req.user.admin) {
            const { grade, Class, ClassId, Date } = req.body;
            const list = [grade, Class, ClassId, Date];
            console.log(list)
            function set_find() {
                let find = {};
                let i = 0;
                while (i < list.length) {
                    if (i == 0) {
                        find.grade = grade;
                    }
                    if (i == 1) {
                        find.class = Class;
                    }
                    if (i == 2) {
                        if (ClassId == "" || ClassId == undefined) { } else {
                            find.classId = ClassId;
                        }
                    }
                    if (i == 3) {
                        if (Date == "" || Date == undefined) { return find; } else {
                            find.date = Date;
                            return find;
                        } 
                    }
                    i++;
                };
            }
            const payment_info = await set_find();
            const payments = await Attendance.find(payment_info);
            if (!payments) {
                throw new Error('Attendance not found');
            }
            res.status(200).send({ status: 'Attendance Fetched', payments:payments });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.patch('/mark/:id', auth, async (req, res) => {
    try {
        const studentID = req.params.id;
        const { paid, date } = req.body;
        const student = await Student.findById(studentID);
        if (!student) {
            throw new Error('Student not found');
        }
        if (student.status == "Inactive") {
            throw new Error('Student account has been inactivated');
        }
        const mark_student = await Student.findByIdAndUpdate(studentID, { attendance: 'PRESENT' });
        const at_student = {
            fname: student.fname,
            lname: student.lname,
            class: student.class,
            grade: student.grade,
            classId: student.classId,
            date: date,
            attendance: 'PRESENT'
        };
        const at_attendance = new Attendance(at_student);
        await at_attendance.save();
        if (paid) {
            const paid_student = {
                fname: student.fname,
                lname: student.lname,
                class: student.class,
                grade: student.grade,
                classId: student.classId,
                date: date
            };
            const pa_payment = new Payment(paid_student);
            await pa_payment.save();
        }
        res.status(200).send({ status: 'Student marked', phone: student.tel_number });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.patch('/update/:id', auth, async (req, res) => {
    try {
        const studentID = req.params.id;
        const { fname, lname, tel_number, nic } = req.body;
        const stu = await Student.findById(studentID);
        const check_nic = await Student.findOne({ nic });
        console.log(JSON.stringify(stu._id));
        console.log(JSON.stringify(check_nic._id))
        if (check_nic) {
            if (JSON.stringify(check_nic._id) !== JSON.stringify(stu._id)) {
                throw new Error('NIC number already exists');
            }
        }
        const check_number = await Student.findOne({ tel_number });
        if (check_number) {
            if (JSON.stringify(check_number._id) !== JSON.stringify(stu._id)) {
                throw new Error('Mobile number already exists');
            }
        }

        const student = {
            fname: fname,
            lname: lname,
            tel_number: tel_number,
            nic: nic
        };
        const updateStudent = await Student.findByIdAndUpdate(studentID, student);
        res.status(200).send({ status: 'Student updated', updated_student: student });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.patch('/changestatus/:id', auth, async (req, res) => {
    try {
        const studentID = req.params.id;
        const student = await Student.findById(studentID);
        const updateStudent = await Student.findByIdAndUpdate(studentID, { status: (student.status == "Active") ? "Inactive" : "Active" });
        res.status(200).send({ message: `${(student.status == "Active") ? "Inactive" : "Active"}` });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const studentID = req.params.id;
        const student_delete = await Student.findByIdAndDelete(studentID);
        res.status(200).send({ status: 'Student deleted' })
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Upgrade Student
// Next Function


module.exports = router;