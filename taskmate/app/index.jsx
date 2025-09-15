import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, Button, TouchableOpacity } from 'react-native';
import TaskItem from '../src/components/TaskItem';
import { dummyTasks } from '../src/data/dummyTasks';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';

export default function HomeScreen() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState("All");
    const [showFilter, setshowFilter] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await loadTasks();
            setTasks(data);
        })();
    }, []);

    const handleToggle = async (task) => {
        const updated = tasks.map((t) => {
            if (t.id === task.id) {
                if (t.status === 'todo') {
                    return { ...t, status: 'pending' };
                } else if (t.status === 'pending') {
                    return { ...t, status: 'done' };
                } else {
                    return { ...t, status: 'todo' };
                }
            }
            return t;
        });
        setTasks(updated);
        await saveTasks(updated);
    };

    const handleDelete = async (task) => {
        const updated = tasks.filter((t) => t.id !== task.id);
        setTasks(updated);
        await saveTasks(updated);
    }

    const filteredTasks = tasks.filter((task) => {
        if (filter === "All") return true;
        return task.status === filter;
    });

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>TaskMate – Daftar Tugas</Text>
            <Button
                title={showFilter ? "Hide Filter" : "Show Filter"}
                onPress={() => setshowFilter((show) => !show)}
            />

            {/* filter button */}
            {showFilter && (
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === "All" && styles.activeButton]}
                        onPress={() => setFilter("All")}>
                        <Text style={[styles.filterText, filter === "All" && styles.activeText]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === "pending" && styles.activeButton]}
                        onPress={() => setFilter("pending")}>
                        <Text
                            style={[
                                styles.filterText,
                                filter === "pending" && styles.activeText,
                            ]}>
                            Pending
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === "todo" && styles.activeButton]}
                        onPress={() => setFilter("todo")}>
                        <Text
                            style={[
                                styles.filterText,
                                filter === "todo" && styles.activeText,
                            ]}>
                            Todo
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === "done" && styles.activeButton]}
                        onPress={() => setFilter("done")}>
                        <Text style={[styles.filterText, filter === "done" && styles.activeText]}>
                            Done
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => <TaskItem
                    task={item}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center' }}>Tidak ada tugas</Text>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { fontSize: 20, fontWeight: '700', padding: 16 },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "#e0e0e0",
    },
    activeButton: {
        backgroundColor: "#007AFF",
    },
    filterText: {
        fontSize: 14,
        color: "#333",
    },
    activeText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
