import { PracticalSet, StudentSubmission } from '../types';

export const DEFAULT_PRACTICAL_SETS: PracticalSet[] = [
  {
    id: 'Set 1',
    name: 'Set 1: Object-Oriented Principles & Class Design',
    topic: 'Encapsulation, Constructors, Getters/Setters & Object State',
    targetClass: 'Class 1',
    maxMarks: 100,
    questionPaper: `TAR UMT Department of Computer Science
C++ Practical Assessment - Practical Set 1
Duration: 2 Hours | Total Marks: 100

QUESTION:
You are required to develop a C++ program implementing an ATM/Bank Account Management System.
The program must fulfill the following technical specifications:
1. Define a class 'BankAccount' with private data members:
   - accountNumber (std::string)
   - accountHolderName (std::string)
   - balance (double)
2. Provide a parameterized constructor with input validation (initial balance >= 0.0).
3. Implement member functions:
   - void deposit(double amount): Prevents negative deposits.
   - bool withdraw(double amount): Deducts funds if sufficient balance, otherwise displays insufficient funds error.
   - void displayAccountDetails() const: Uses const-correctness to output details neatly.
   - double getBalance() const: Returns current balance.
4. In main():
   - Create at least two BankAccount objects (test valid and edge values).
   - Perform deposit and withdrawal operations with appropriate error handling.
   - Ensure clean console formatting and no memory leaks.`,
    markingScheme: `MARKING SCHEME - SET 1:
1. Class Encapsulation & Members (20 Marks):
   - Correct private data members with appropriate data types (10 Marks)
   - Proper access specifier separation and data hiding (10 Marks)
2. Constructors & Validation (20 Marks):
   - Parameterized constructor implementation (10 Marks)
   - Validation against negative initial balance with default fallback (10 Marks)
3. Member Functions & Correctness (30 Marks):
   - deposit() logic with positive amount check (10 Marks)
   - withdraw() balance check, deduction, and error message (10 Marks)
   - displayAccountDetails() & getBalance() with const correctness (10 Marks)
4. Main Function Testing & Edge Cases (15 Marks):
   - Comprehensive testing covering normal flow and insufficient funds edge cases (15 Marks)
5. C++ Code Quality & Style (15 Marks):
   - Proper indentation, meaningful variable names, inline comments, and #include directives (15 Marks)`,
    rubrics: [
      {
        id: 'set1_encapsulation',
        name: 'Class Encapsulation & Member Variables',
        maxMarks: 20,
        description: 'Private data members, proper types, and encapsulation integrity.',
      },
      {
        id: 'set1_constructors',
        name: 'Constructor Design & Input Validation',
        maxMarks: 20,
        description: 'Parameterized constructor and guard clauses for balance values.',
      },
      {
        id: 'set1_methods',
        name: 'Deposit, Withdraw & Const Methods',
        maxMarks: 30,
        description: 'Functional correctness of operations, balance checks, and const modifiers.',
      },
      {
        id: 'set1_main_testing',
        name: 'Main Driver & Edge Case Coverage',
        maxMarks: 15,
        description: 'Demonstrates thorough testing of standard scenarios and edge cases.',
      },
      {
        id: 'set1_code_quality',
        name: 'Coding Standards, Indentation & Comments',
        maxMarks: 15,
        description: 'Clean C++ idioms, appropriate naming, and descriptive commentary.',
      },
    ],
  },
  {
    id: 'Set 2',
    name: 'Set 2: Pointers, Dynamic Memory & Linked Lists',
    topic: 'Raw Pointers, Dynamic Allocation (new/delete) & Zero Memory Leaks',
    targetClass: 'Class 2',
    maxMarks: 100,
    questionPaper: `TAR UMT Department of Computer Science
C++ Practical Assessment - Practical Set 2
Duration: 2 Hours | Total Marks: 100

QUESTION:
You are required to implement a Singly Linked List in C++ from scratch to manage a queue of student IDs.
Technical Specifications:
1. Define a struct 'Node' with an integer data field and a pointer to the next Node ('Node* next').
2. Define a class 'StudentLinkedList' with a private pointer 'Node* head'.
3. Implement member functions:
   - void insertAtHead(int id): Inserts a new node at the front.
   - void insertAtTail(int id): Appends a node at the end.
   - bool deleteById(int id): Deletes the node containing the target ID and frees its memory.
   - void displayList() const: Traverses the list and prints all nodes in sequence.
   - int countNodes() const: Returns total count.
4. Implement a custom Destructor (~StudentLinkedList) that traverses and deallocates every dynamically allocated Node using 'delete' to prevent memory leaks.
5. In main():
   - Demonstrate inserting 4-5 nodes, deleting an intermediate node, and printing before/after states.`,
    markingScheme: `MARKING SCHEME - SET 2:
1. Node Structure & Class Definition (15 Marks):
   - Proper Node struct with data and pointer, head pointer initialized to nullptr (15 Marks)
2. Insertion Operations (25 Marks):
   - insertAtHead() correctly adjusting head pointer (10 Marks)
   - insertAtTail() handling both empty list and traversal to last node (15 Marks)
3. Deletion & Memory Deallocation (25 Marks):
   - deleteById() handling head deletion, middle/tail deletion, and not-found cases (15 Marks)
   - Calling delete on the target node to prevent memory leaks (10 Marks)
4. Destructor & Memory Leak Prevention (20 Marks):
   - Complete iterative teardown in ~StudentLinkedList() ensuring every node is freed (20 Marks)
5. Traversal & Main Driver Demonstration (15 Marks):
   - Accurate displayList(), countNodes(), and clear console verification (15 Marks)`,
    rubrics: [
      {
        id: 'set2_node_class',
        name: 'Node Struct & List Architecture',
        maxMarks: 15,
        description: 'Correct struct declaration, head pointer initialization and safety.',
      },
      {
        id: 'set2_insertions',
        name: 'Head & Tail Insertion Algorithms',
        maxMarks: 25,
        description: 'Pointer manipulation and edge case handling for empty vs populated lists.',
      },
      {
        id: 'set2_deletion',
        name: 'Target Deletion & Node Freeing',
        maxMarks: 25,
        description: 'Accurate pointer relinking and immediate delete deallocation.',
      },
      {
        id: 'set2_destructor',
        name: 'Destructor & Zero Memory Leak Hygiene',
        maxMarks: 20,
        description: 'Systematic loop deallocating every node upon list destruction.',
      },
      {
        id: 'set2_traversal_main',
        name: 'Traversal Logic & Main Test Suite',
        maxMarks: 15,
        description: 'Proper const traversal, boundary verification, and clean output.',
      },
    ],
  },
  {
    id: 'Set 3',
    name: 'Set 3: Operator Overloading & Polymorphic Inheritance',
    topic: 'Operator Overloading (+, ==, <<), Virtual Functions & Abstract Base Classes',
    targetClass: 'Class 3',
    maxMarks: 100,
    questionPaper: `TAR UMT Department of Computer Science
C++ Practical Assessment - Practical Set 3
Duration: 2 Hours | Total Marks: 100

QUESTION:
You are required to build a 2D Vector and Geometry Shape Hierarchy in C++.
Part A - Operator Overloading:
1. Create a class 'Vector2D' with double x and y coordinates.
2. Overload the binary addition operator '+' to add two Vector2D instances.
3. Overload the equality operator '==' with floating-point tolerance (epsilon check).
4. Overload the stream insertion operator '<<' as a friend function to output in format "(x, y)".

Part B - Polymorphism:
5. Create an abstract base class 'Shape' with:
   - pure virtual double calculateArea() const = 0;
   - pure virtual void render() const = 0;
   - virtual ~Shape() {} (virtual destructor)
6. Derive concrete classes 'Circle' and 'Rectangle'.
7. In main(), demonstrate runtime polymorphism using a collection or array of base class pointers 'Shape*'.`,
    markingScheme: `MARKING SCHEME - SET 3:
1. Vector2D Class & Operator + (20 Marks):
   - Overloaded operator+ returning a new Vector2D by value (20 Marks)
2. Stream Operator << & Equality == (20 Marks):
   - Friend std::ostream& operator<<(std::ostream&, const Vector2D&) (10 Marks)
   - Proper operator== implementation (10 Marks)
3. Abstract Base Class 'Shape' (20 Marks):
   - Pure virtual functions syntax (= 0) and virtual destructor (20 Marks)
4. Concrete Derived Classes (20 Marks):
   - Circle & Rectangle correctly overriding virtual methods with override keyword (20 Marks)
5. Polymorphic Execution & Main Suite (20 Marks):
   - Demonstration of dynamic dispatch via base pointers and clean memory cleanup (20 Marks)`,
    rubrics: [
      {
        id: 'set3_operator_plus',
        name: 'Operator Overloading (+)',
        maxMarks: 20,
        description: 'Correct signature, pass-by-const-ref, and return by value.',
      },
      {
        id: 'set3_stream_operators',
        name: 'Stream Insertion (<<) & Comparison (==)',
        maxMarks: 20,
        description: 'Friend function syntax, chainable stream return, and logical equality.',
      },
      {
        id: 'set3_abstract_base',
        name: 'Abstract Base Class & Virtual Destructor',
        maxMarks: 20,
        description: 'Pure virtual methods and essential virtual destructor for base cleanup.',
      },
      {
        id: 'set3_derived_classes',
        name: 'Derived Classes Implementation & Override',
        maxMarks: 20,
        description: 'Accurate geometric calculation algorithms for Circle and Rectangle.',
      },
      {
        id: 'set3_dynamic_dispatch',
        name: 'Runtime Polymorphism & Driver Verification',
        maxMarks: 20,
        description: 'Dynamic dispatch via Shape* pointers and proper resource cleanup.',
      },
    ],
  },
  {
    id: 'Set 4',
    name: 'Set 4: Modern C++ STL, File Streams & Exceptions',
    topic: 'std::vector / std::map, ifstream / ofstream, Custom Exceptions & Robust Validation',
    targetClass: 'Class 4',
    maxMarks: 100,
    questionPaper: `TAR UMT Department of Computer Science
C++ Practical Assessment - Practical Set 4
Duration: 2 Hours | Total Marks: 100

QUESTION:
You are required to build a Student Gradebook File Processing System in C++.
Technical Specifications:
1. Define a struct or class 'StudentScore' containing studentId (string), name (string), and score (int).
2. Create a custom exception class 'InvalidScoreException' inheriting from std::exception with a custom what() method.
3. Implement a class 'GradebookManager' with:
   - std::vector<StudentScore> records: Storage using Modern C++ STL container.
   - void loadFromFile(const std::string& filename): Reads comma-separated records from a file using std::ifstream. Throws std::runtime_error if file cannot be opened.
   - void addRecord(const StudentScore& record): Validates score is between 0 and 100; throws InvalidScoreException if out of range.
   - double calculateAverage() const: Returns class average.
   - void saveSummaryToFile(const std::string& outputFile) const: Writes total students, class average, highest scorer, and list of students using std::ofstream.
4. In main():
   - Wrap operations in try-catch blocks to catch custom and standard exceptions gracefully.`,
    markingScheme: `MARKING SCHEME - SET 4:
1. STL Container & StudentScore Structure (15 Marks):
   - Proper struct/class and use of std::vector with clean typing (15 Marks)
2. Custom Exception Handling (20 Marks):
   - Class InvalidScoreException inheriting std::exception and overriding const char* what() noexcept (20 Marks)
3. File I/O Input Stream Processing (25 Marks):
   - std::ifstream open check, string parsing/splitting, and error throwing (25 Marks)
4. Score Validation & File Output Stream (25 Marks):
   - Proper score boundary check throwing custom exception (10 Marks)
   - std::ofstream formatted writing with summary statistics (15 Marks)
5. Main Try-Catch Architecture & Code Robustness (15 Marks):
   - Proper multi-catch or hierarchical catch blocks and user-friendly error reporting (15 Marks)`,
    rubrics: [
      {
        id: 'set4_stl_struct',
        name: 'Data Architecture & STL Containers',
        maxMarks: 15,
        description: 'Modern std::vector usage, proper data types, and container operations.',
      },
      {
        id: 'set4_custom_exception',
        name: 'Custom Exception Hierarchy Design',
        maxMarks: 20,
        description: 'Inheritance from std::exception and override of what() method.',
      },
      {
        id: 'set4_file_input',
        name: 'File Input Stream (ifstream) & Parsing',
        maxMarks: 25,
        description: 'File existence verification, line parsing, and stream error guarding.',
      },
      {
        id: 'set4_file_output',
        name: 'File Output Stream (ofstream) & Analysis',
        maxMarks: 25,
        description: 'Formatted file writing, averages computation, and resource closure.',
      },
      {
        id: 'set4_try_catch',
        name: 'Exception Handling & Main Driver Safety',
        maxMarks: 15,
        description: 'Robust try-catch blocks preventing runtime crashes and reporting errors.',
      },
    ],
  },
];

export const SAMPLE_STUDENT_SUBMISSIONS: StudentSubmission[] = [
  // Class 1 - Set 1
  {
    id: 'sub_1',
    filename: 'Alex Tan_Set 1.cpp',
    fileSize: 2420,
    classId: 'Class 1',
    setId: 'Set 1',
    studentId: '',
    studentName: 'Alex Tan',
    status: 'pending',
    content: `#include <iostream>
#include <string>
#include <iomanip>

class BankAccount {
private:
    std::string accountNumber;
    std::string accountHolderName;
    double balance;

public:
    // Parameterized constructor with validation
    BankAccount(std::string accNum, std::string name, double initialBalance)
        : accountNumber(accNum), accountHolderName(name) {
        if (initialBalance >= 0.0) {
            balance = initialBalance;
        } else {
            std::cout << "[Warning] Negative balance specified! Defaulting balance to 0.0" << std::endl;
            balance = 0.0;
        }
    }

    void deposit(double amount) {
        if (amount > 0.0) {
            balance += amount;
            std::cout << "Successfully deposited $" << std::fixed << std::setprecision(2) << amount << std::endl;
        } else {
            std::cout << "[Error] Deposit amount must be strictly positive." << std::endl;
        }
    }

    bool withdraw(double amount) {
        if (amount <= 0.0) {
            std::cout << "[Error] Withdrawal amount must be greater than zero." << std::endl;
            return false;
        }
        if (amount > balance) {
            std::cout << "[Error] Insufficient funds! Current balance: $" << balance << std::endl;
            return false;
        }
        balance -= amount;
        std::cout << "Successfully withdrew $" << amount << ". New balance: $" << balance << std::endl;
        return true;
    }

    void displayAccountDetails() const {
        std::cout << "----------------------------------------" << std::endl;
        std::cout << "Account Number : " << accountNumber << std::endl;
        std::cout << "Holder Name    : " << accountHolderName << std::endl;
        std::cout << "Current Balance: $" << std::fixed << std::setprecision(2) << balance << std::endl;
        std::cout << "----------------------------------------" << std::endl;
    }

    double getBalance() const {
        return balance;
    }
};

int main() {
    std::cout << "=== Set 1 Practical: Bank Account System ===" << std::endl;
    
    // Normal case
    BankAccount acc1("ACC-1001", "Alex Tan", 500.00);
    acc1.displayAccountDetails();
    acc1.deposit(250.00);
    acc1.withdraw(100.00);
    
    // Edge case: overdraft attempt
    std::cout << "\\nTesting Overdraft Boundary:" << std::endl;
    acc1.withdraw(9999.00);

    // Edge case: negative initial balance
    std::cout << "\\nTesting Negative Initial Balance:" << std::endl;
    BankAccount acc2("ACC-1002", "Invalid User", -50.00);
    acc2.displayAccountDetails();

    return 0;
}
`,
  },
  // Class 1 - Set 1 (Another student with minor flaws)
  {
    id: 'sub_2',
    filename: 'Chloe Lim_Set 1.cpp',
    fileSize: 1850,
    classId: 'Class 1',
    setId: 'Set 1',
    studentId: '',
    studentName: 'Chloe Lim',
    status: 'pending',
    content: `#include <iostream>
using namespace std;

class BankAccount {
public:
    string accountNumber; // Should be private
    string accountHolderName;
    double balance;

    BankAccount(string acc, string name, double bal) {
        accountNumber = acc;
        accountHolderName = name;
        balance = bal; // Missing check for negative balance
    }

    void deposit(double amt) {
        balance += amt; // Missing check for negative deposit
        cout << "Deposited: " << amt << endl;
    }

    void withdraw(double amt) {
        if (amt <= balance) {
            balance -= amt;
            cout << "Withdrew: " << amt << endl;
        } else {
            cout << "No enough money!" << endl;
        }
    }

    void displayAccountDetails() { // Missing const modifier
        cout << "Acc: " << accountNumber << " Name: " << accountHolderName << " Bal: " << balance << endl;
    }
};

int main() {
    BankAccount b1("123", "Chloe Lim", 200.0);
    b1.displayAccountDetails();
    b1.deposit(50);
    b1.withdraw(300);
    return 0;
}
`,
  },
  // Class 2 - Set 2
  {
    id: 'sub_3',
    filename: 'Daniel Lee_Set 2.cpp',
    fileSize: 3100,
    classId: 'Class 2',
    setId: 'Set 2',
    studentId: '',
    studentName: 'Daniel Lee',
    status: 'pending',
    content: `#include <iostream>

struct Node {
    int id;
    Node* next;
    Node(int val) : id(val), next(nullptr) {}
};

class StudentLinkedList {
private:
    Node* head;

public:
    StudentLinkedList() : head(nullptr) {}

    ~StudentLinkedList() {
        // Safe destructor freeing every node
        Node* current = head;
        while (current != nullptr) {
            Node* temp = current;
            current = current->next;
            delete temp;
        }
        head = nullptr;
    }

    void insertAtHead(int id) {
        Node* newNode = new Node(id);
        newNode->next = head;
        head = newNode;
    }

    void insertAtTail(int id) {
        Node* newNode = new Node(id);
        if (head == nullptr) {
            head = newNode;
            return;
        }
        Node* current = head;
        while (current->next != nullptr) {
            current = current->next;
        }
        current->next = newNode;
    }

    bool deleteById(int id) {
        if (head == nullptr) return false;
        
        if (head->id == id) {
            Node* temp = head;
            head = head->next;
            delete temp;
            return true;
        }

        Node* current = head;
        while (current->next != nullptr && current->next->id != id) {
            current = current->next;
        }

        if (current->next != nullptr) {
            Node* toDelete = current->next;
            current->next = current->next->next;
            delete toDelete;
            return true;
        }

        return false;
    }

    void displayList() const {
        Node* current = head;
        std::cout << "List: ";
        while (current != nullptr) {
            std::cout << "[" << current->id << "] -> ";
            current = current->next;
        }
        std::cout << "nullptr" << std::endl;
    }

    int countNodes() const {
        int count = 0;
        Node* current = head;
        while (current != nullptr) {
            count++;
            current = current->next;
        }
        return count;
    }
};

int main() {
    StudentLinkedList list;
    list.insertAtTail(101);
    list.insertAtTail(102);
    list.insertAtHead(99);
    list.insertAtTail(105);

    std::cout << "Initial list (Count = " << list.countNodes() << "):\\n";
    list.displayList();

    std::cout << "\\nDeleting node 102:\\n";
    list.deleteById(102);
    list.displayList();

    std::cout << "\\nDeleting non-existing node 999: " << (list.deleteById(999) ? "Found" : "Not Found") << "\\n";
    return 0;
}
`,
  },
  // Class 3 - Set 3
  {
    id: 'sub_4',
    filename: 'Farhan Ahmad_Set 3.cpp',
    fileSize: 2850,
    classId: 'Class 3',
    setId: 'Set 3',
    studentId: '',
    studentName: 'Farhan Ahmad',
    status: 'pending',
    content: `#include <iostream>
#include <vector>
#include <cmath>

class Vector2D {
private:
    double x, y;

public:
    Vector2D(double xVal = 0.0, double yVal = 0.0) : x(xVal), y(yVal) {}

    Vector2D operator+(const Vector2D& other) const {
        return Vector2D(x + other.x, y + other.y);
    }

    bool operator==(const Vector2D& other) const {
        return (std::abs(x - other.x) < 1e-6) && (std::abs(y - other.y) < 1e-6);
    }

    friend std::ostream& operator<<(std::ostream& os, const Vector2D& vec) {
        os << "(" << vec.x << ", " << vec.y << ")";
        return os;
    }
};

class Shape {
public:
    virtual ~Shape() = default;
    virtual double calculateArea() const = 0;
    virtual void render() const = 0;
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    double calculateArea() const override {
        return 3.14159265359 * radius * radius;
    }
    void render() const override {
        std::cout << "Circle (radius: " << radius << ", Area: " << calculateArea() << ")\\n";
    }
};

class Rectangle : public Shape {
private:
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double calculateArea() const override {
        return width * height;
    }
    void render() const override {
        std::cout << "Rectangle (" << width << "x" << height << ", Area: " << calculateArea() << ")\\n";
    }
};

int main() {
    Vector2D v1(3.0, 4.0);
    Vector2D v2(1.5, 2.5);
    Vector2D v3 = v1 + v2;
    std::cout << "Vector addition: " << v1 << " + " << v2 << " = " << v3 << std::endl;

    std::vector<Shape*> shapes;
    shapes.push_back(new Circle(5.0));
    shapes.push_back(new Rectangle(4.0, 6.0));

    std::cout << "\\nPolymorphic Shapes:\\n";
    for (Shape* s : shapes) {
        s->render();
    }

    // Cleanup dynamically allocated shapes
    for (Shape* s : shapes) {
        delete s;
    }
    shapes.clear();

    return 0;
}
`,
  },
  // Class 4 - Set 4
  {
    id: 'sub_5',
    filename: 'Grace Ong_Set 4.cpp',
    fileSize: 3400,
    classId: 'Class 4',
    setId: 'Set 4',
    studentId: '',
    studentName: 'Grace Ong',
    status: 'pending',
    content: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <fstream>
#include <exception>
#include <numeric>

class InvalidScoreException : public std::exception {
private:
    std::string message;
public:
    InvalidScoreException(int score) {
        message = "Invalid score provided: " + std::to_string(score) + ". Score must be between 0 and 100.";
    }
    const char* what() const noexcept override {
        return message.c_str();
    }
};

struct StudentScore {
    std::string studentId;
    std::string name;
    int score;
};

class GradebookManager {
private:
    std::vector<StudentScore> records;

public:
    void addRecord(const StudentScore& record) {
        if (record.score < 0 || record.score > 100) {
            throw InvalidScoreException(record.score);
        }
        records.push_back(record);
    }

    double calculateAverage() const {
        if (records.empty()) return 0.0;
        double sum = 0;
        for (const auto& r : records) sum += r.score;
        return sum / records.size();
    }

    void saveSummaryToFile(const std::string& outputFile) const {
        std::ofstream outFile(outputFile);
        if (!outFile.is_open()) {
            throw std::runtime_error("Unable to open output file: " + outputFile);
        }
        outFile << "=== GRADEBOOK SUMMARY ===\\n";
        outFile << "Total Students: " << records.size() << "\\n";
        outFile << "Class Average: " << calculateAverage() << "\\n\\n";
        outFile << "Student Details:\\n";
        for (const auto& r : records) {
            outFile << r.studentId << " - " << r.name << ": " << r.score << "\\n";
        }
        outFile.close();
    }

    size_t getCount() const { return records.size(); }
};

int main() {
    GradebookManager manager;
    try {
        manager.addRecord({"B220401", "Grace Ong", 88});
        manager.addRecord({"B220402", "Kenji Sato", 94});
        manager.addRecord({"B220403", "Aisha Noor", 76});
        
        std::cout << "Successfully processed " << manager.getCount() << " student records.\\n";
        std::cout << "Class average: " << manager.calculateAverage() << std::endl;

        manager.saveSummaryToFile("gradebook_summary.txt");
        std::cout << "Saved summary to gradebook_summary.txt\\n";

        // Testing exception handling
        std::cout << "\\nTriggering boundary validation:\\n";
        manager.addRecord({"B220499", "Faulty Record", 125}); // Should trigger exception
    }
    catch (const InvalidScoreException& e) {
        std::cerr << "[Caught Custom Exception] " << e.what() << std::endl;
    }
    catch (const std::exception& e) {
        std::cerr << "[Standard Exception] " << e.what() << std::endl;
    }

    return 0;
}
`,
  },
];
