export interface Lecture {
    id: string;
    number: number;
    title: string;
    content: string; // Simulated text content or description
    pdfUrl?: string; // Optional path to a real PDF file in public/
}

export interface Course {
    id: string;
    title: string;
    description: string;
    semester: string;
    progress: number;
    lectures: Lecture[];
}

export const DATA_STRUCTURES_LECTURES: Lecture[] = [
    {
        id: 'lec-1',
        number: 1,
        title: 'Introduction to Algorithms',
        content: "Course overview, computational thinking, and peak finding. (PDF Available)",
        pdfUrl: '/lectures/lec1.pdf'
    },
    {
        id: 'lec-2',
        number: 2,
        title: 'Data Structures & Dynamic Arrays',
        content: "Sequence interface, array resizing, and amortization. (PDF Available)",
        pdfUrl: '/lectures/lec2.pdf'
    },
    {
        id: 'lec-3',
        number: 3,
        title: 'Sets & Sorting',
        content: "Set interface, direct access arrays, and sorting algorithms. (PDF Available)",
        pdfUrl: '/lectures/lec3.pdf'
    },
    {
        id: 'lec-4',
        number: 4,
        title: 'Hashing',
        content: "Hash tables, collision resolution, and hash functions. (PDF Available)",
        pdfUrl: '/lectures/lec4.pdf'
    },
    {
        id: 'lec-5',
        number: 5,
        title: 'Linear Sorting',
        content: "Counting sort, radix sort, and lower bounds. (PDF Available)",
        pdfUrl: '/lectures/lec5.pdf'
    },
    {
        id: 'lec-6',
        number: 6,
        title: 'Binary Trees',
        content: "Binary search trees, tree traversal, and height balancing. (PDF Available)",
        pdfUrl: '/lectures/lec6.pdf'
    },
    {
        id: 'lec-7',
        number: 7,
        title: 'AVL Trees',
        content: "AVL tree rotations, insertion, and deletion. (PDF Available)",
        pdfUrl: '/lectures/lec7.pdf'
    },
    {
        id: 'lec-8',
        number: 8,
        title: 'Binary Heaps',
        content: "Priority queues, heap operations, and heap sort. (PDF Available)",
        pdfUrl: '/lectures/lec8.pdf'
    },
    {
        id: 'lec-9',
        number: 9,
        title: 'Breadth-First Search',
        content: "Graph representations, BFS algorithm, and shortest paths. (PDF Available)",
        pdfUrl: '/lectures/lec9.pdf'
    },
    {
        id: 'lec-10',
        number: 10,
        title: 'Depth-First Search',
        content: "DFS algorithm, topological sort, and cycle detection. (PDF Available)",
        pdfUrl: '/lectures/lec10.pdf'
    }
];

export const ROBOTICS_LECTURES: Lecture[] = [
    {
        id: 'robo-1',
        number: 1,
        title: 'Introduction to Robotics',
        content: "Basic concepts, history, and applications of robotics.",
        pdfUrl: '/robotics/chapter1.pdf'
    },
    {
        id: 'robo-2',
        number: 2,
        title: 'Spatial Descriptions and Transformations',
        content: "Positions, orientations, and frames of reference.",
        pdfUrl: '/robotics/chapter2.pdf'
    },
    {
        id: 'robo-3',
        number: 3,
        title: 'Manipulator Kinematics',
        content: "Forward and inverse kinematics of manipulators.",
        pdfUrl: '/robotics/chapter3.pdf'
    },
    {
        id: 'robo-4',
        number: 4,
        title: 'Jacobian: Velocities and Static Forces',
        content: "Velocity analysis and static force propagation.",
        pdfUrl: '/robotics/chapter4.pdf'
    },
    {
        id: 'robo-5',
        number: 5,
        title: 'Manipulator Dynamics',
        content: "Equations of motion and dynamic modeling.",
        pdfUrl: '/robotics/chapter5.pdf'
    },
    {
        id: 'robo-6',
        number: 6,
        title: 'Control of Manipulators',
        content: "Control system architecture and feedback control.",
        pdfUrl: '/robotics/chapter6.pdf'
    },
    {
        id: 'robo-7',
        number: 7,
        title: 'Trajectory Generation',
        content: "Path planning and trajectory generation techniques.",
        pdfUrl: '/robotics/chapter7.pdf'
    },
    {
        id: 'robo-9',
        number: 9,
        title: 'Linear Control of Manipulators',
        content: "Linear control methods for robotic systems.",
        pdfUrl: '/robotics/chapter9.pdf'
    }
];

export const COURSES: Course[] = [
    {
        id: 'data-structures',
        title: 'Data Structures',
        description: 'CS 201 • Fall 2024',
        semester: 'Fall 2024',
        progress: 65,
        lectures: DATA_STRUCTURES_LECTURES
    },
    {
        id: 'robotics',
        title: 'Introduction to Robotics',
        description: 'ME 401 • Spring 2025',
        semester: 'Spring 2025',
        progress: 10,
        lectures: ROBOTICS_LECTURES
    }
];

// Keep for backward compatibility if needed, or alias to the first course
export const COURSE_DATA = DATA_STRUCTURES_LECTURES;
